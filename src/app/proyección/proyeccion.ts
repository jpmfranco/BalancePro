import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { IaService } from '../Services/IAService'
import { UsuarioService } from '../Services/usuario-service';
import { HttpClient } from '@angular/common/http';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis,
  ApexStroke, ApexLegend, ApexDataLabels, ApexFill, ApexMarkers, ApexTooltip
} from 'ng-apexcharts';

@Component({
  selector: 'app-proyeccion',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterLink],
  templateUrl: './proyeccion.html',
  styleUrls: ['./proyeccion.css']
})
export class Proyeccion implements OnInit {

  ahorroConsejos: any[] = [];
  totalAhorroPotencial: number = 0;
  menuOpen = signal(false);
  monthlyProjections: any[] = [];
  movements: any[] = [];
  public chartOptions: any;
  private idUsuario: number = 1;
  errorPerfil: string = '';

  constructor(
    private router: Router,
    private iaService: IaService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatosUsuario(usuarioStr);
    this.obtenerGastosRealesIA();
  }
   cargarDatosUsuario(correo: string): void {
    this.usuarioService.getUsers().subscribe({
      next: (res) => {
        const usuarioEncontrado = res.find((u: any) => u.correo === correo);
        this.idUsuario = usuarioEncontrado.id;
        console.log(this.idUsuario);
        this.cargarProyeccionesIA();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  private initChartOptions() {
    this.chartOptions = {
      series: [],
      chart: { 
        height: 380, 
        type: 'area', 
        toolbar: { show: false }, 
        background: 'transparent',
        animations: { enabled: true },
        zoom: { enabled: false }
      },
      colors: ['#22c55e', '#ef4444'],
      dataLabels: {
        enabled: true,
        formatter: (val: any) => '$' + Math.round(Number(val)).toLocaleString(),
        style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
        background: { enabled: true, foreColor: '#fff', padding: 4, borderRadius: 4, borderColor: '#334155' }
      },
      stroke: { width: [3, 1.5], curve: 'smooth' },
      fill: {
        type: ['gradient', 'solid'],
        gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05, stops: [0, 90, 100] }
      },
      markers: { size: 4, strokeColors: '#334155' },
      xaxis: { 
        categories: [], 
        labels: { style: { colors: '#94a3b8' } } 
      },
      yaxis: { 
        min: 0, 
        labels: { 
          style: { colors: '#94a3b8' },
          formatter: (val: any) => `$${Math.round(val).toLocaleString()}`
        } 
      },
      tooltip: { theme: 'dark' },
      legend: { show: true, position: 'top', labels: { colors: '#f8fafc' } },
      grid: { borderColor: '#334155', strokeDashArray: 4 }
    };
  }

  consejoIA_Texto: string = "Analizando tus gastos...";

obtenerGastosRealesIA() {
  console.log(this.idUsuario,"id");
  this.usuarioService.getGastos().subscribe({
    next: (gastos: any[]) => {
      // Filtramos los reales
      const gastosMalosReales = gastos.filter(g => 
        g.idUsuario === this.idUsuario && g.clasificacion === 'Malo'
      );

      this.ahorroConsejos = gastosMalosReales.map(g => ({
        concepto: g.descripcion,
        frecuencia: 'Gasto detectado',
        montoAhorro: g.monto
      }));

      this.totalAhorroPotencial = this.ahorroConsejos.reduce((acc, curr) => acc + curr.montoAhorro, 0);

      // LLAMADA A TU SCRIPT DE PYTHON (Puerto 8080)
      if (this.ahorroConsejos.length > 0) {
        this.http.post('http://localhost:8080/analizar-ahorro', {
          gastos: this.ahorroConsejos,
          totalAhorro: this.totalAhorroPotencial
        }).subscribe({
          next: (res: any) => {
            this.consejoIA_Texto = res.mensajeMotivacional;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error("Python no responde:", err);
            this.consejoIA_Texto = "No pude conectar con el coach financiero.";
          }
        });
      }
      this.cdr.detectChanges();
    }
  });
}

  getProximosMeses(cantidad: number): string[] {
    const meses = [];
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 1); 
    for (let i = 0; i < cantidad; i++) {
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' });
      meses.push(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));
      fecha.setMonth(fecha.getMonth() + 1);
    }
    return meses;
  }

  cargarProyeccionesIA() {
    this.errorPerfil = '';
    console.log(this.idUsuario,"id");
    this.iaService.obtenerAnalisisIA(this.idUsuario).subscribe({
      next: (res) => {
        console.log(res,"hola");
        const ingresos = res.resumenFinanciero?.totalIngresos || 0;
        const gastos = res.resumenFinanciero?.totalGastos || 0;
        const listaProyecciones = res.prediccionIA?.proyecciones || [];
        const nombresMeses = this.getProximosMeses(3);

        if (listaProyecciones.length > 0) {
          this.monthlyProjections = listaProyecciones.map((p: any, index: number) => {
            const balanceNeto = p.valor - gastos;
            return {
              month: nombresMeses[index],
              balance: balanceNeto,
              isPositive: balanceNeto > 0
            };
          });

          this.chartOptions = {
            ...this.chartOptions,
            series: [
              { name: 'Balance proyectado:', type: 'area', data: [0, ...this.monthlyProjections.map(p => p.balance)] },
              { name: 'Gastos actuales:', type: 'line', data: [0, ...listaProyecciones.map(() => gastos)] }
            ],
            xaxis: { ...this.chartOptions.xaxis, categories: ['Inicio', ...nombresMeses] }
          };
        }

        this.movements = [
          { concepto: 'Sueldo Mensual', tipo: 'Ingreso', monto: ingresos },
          { concepto: 'Gastos Totales', tipo: 'Egreso', monto: gastos },
          { concepto: 'Balance Neto Actual', tipo: 'Ingreso', monto: ingresos - gastos }
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorPerfil = 'Aún no has configurado tu perfil financiero. Ve a la sección "Perfil" para comenzar.';
        } else {
          this.errorPerfil = 'No se pudo cargar el análisis financiero. Intenta de nuevo más tarde.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
  logout() { sessionStorage.clear(); this.router.navigate(['/login']); }
}