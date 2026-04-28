import 'zone.js';
import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment/enviroment';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';
import { UsuarioService } from '../Services/usuario-service';

interface Ingreso {
  descripcion: string;
  fecha: string;
  monto: number;
  idUsuario: number;
}

interface Gasto {
  descripcion: string;
  fecha: string;
  monto: number;
  categoria: string;
  idUsuario: number;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterLink],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class Overview implements OnInit {
  apiI = environment.apiIngreso;
  apiG = environment.apiGasto;
  balance = signal(0);
  menuOpen = signal(false);
  usuario = signal('');
  private idUsuario:number = 0;
  gastosTotal:any = 0;
  ingregosTotal:any = 0;
  gastos:any = [];
  ingresos:any = [];
  chartListo: boolean = false;

  // Modales
  showIngresoModal:boolean = false;
  showGastoModal:boolean = false;
  isLoading:boolean = false
  errorMessage = signal('');
  successMessage = signal('');

  // Formulario de ingreso
  ingreso = signal<Ingreso>({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: 0,
    idUsuario: 1
  });

  // Formulario de gasto
  gasto = signal<Gasto>({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: 0,
    categoria: '',
    idUsuario: 1
  });

  categorias = [
    'Alimentación',
    'Transporte',
    'Vivienda',
    'Servicios',
    'Salud',
    'Educación',
    'Entretenimiento',
    'Ropa',
    'Otros'
  ];

  

  // Configuración de ApexCharts - SIN ERRORES
  chartOptions: Partial<ChartOptions> = this.getDefaultChartOptions([],[],['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']);


  constructor(private router: Router, private http: HttpClient,private usuarioService:UsuarioService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const usuario:any = sessionStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    } else {
      this.usuario.set(usuario);
    }
    this.cargarDatosUsuario(usuario);
  }
  getDefaultChartOptions(dataIngresos: number[], dataGastos: number[], labels: string[]): Partial<ChartOptions> {
  return {
    series: [
      { name: 'Ingresos', data: dataIngresos },
      { name: 'Egresos', data: dataGastos }
    ],
    chart: {
      height: 400,
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, curve: 'smooth' },
    colors: ['#5DADE2', '#EC7063'],
    markers: {
      size: 4,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 6 }
    },
    xaxis: {
      categories: labels,
      labels: { style: { colors: '#666', fontSize: '11px' } }
    },
    yaxis: {
      min: 0,
      labels: {
        style: { colors: '#666', fontSize: '11px' },
        formatter: (value) => value.toLocaleString()
      }
    },
    grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 0 },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      itemMargin: { horizontal: 15, vertical: 5 }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    }
  };
}
  cargarDatosUsuario(correo: string): void {
  this.usuarioService.getUsers().subscribe({
    next: (res) => {
      const usuarioEncontrado = res.find((u: any) => u.correo === correo);
      if (usuarioEncontrado) {
        this.usuario = usuarioEncontrado;
        this.idUsuario = usuarioEncontrado.id;

        // ✅ Solo una llamada aquí, elimina la de getBalance
        this.cargarDatosGrafica(this.idUsuario);
        this.getBalance(usuarioEncontrado); // ✅ pasa el objeto directo
        this.cdr.detectChanges();
      }
    },
    error: (err) => console.error(err)
  });
}
  cargarDatosGrafica(idUsuario: number): void {
  const hoy = new Date();
  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const labels = ultimos7Dias.map(fecha =>
    new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short' })
  );

  this.usuarioService.getGastos().subscribe({
    next: (gastos: any[]) => {
      this.usuarioService.getGIngresos().subscribe({
        next: (ingresos: any[]) => {

          const dataGastos = ultimos7Dias.map(fecha =>
            gastos
              .filter(g => g.fecha.split('T')[0] === fecha && g.idUsuario === idUsuario)
              .reduce((sum, g) => sum + g.monto, 0)
          );

          const dataIngresos = ultimos7Dias.map(fecha =>
            ingresos
              .filter(i => i.fecha.split('T')[0] === fecha && i.idUsuario === idUsuario)
              .reduce((sum, i) => sum + i.monto, 0)
          );

          
          this.chartOptions = this.getDefaultChartOptions(dataIngresos, dataGastos, labels);
          this.chartListo = false; 
          // ✅ detectChanges después de actualizar el chart
          setTimeout(() => {
            this.chartListo = true; // fuerza re-render
            this.cdr.detectChanges();
          }, 50);
        }
      });
    }
  });
}
  getBalance(id: any) {
  this.usuarioService.getGastosSuma(id.id).subscribe({
    next: (res) => {
      this.gastosTotal = res.montoTotal;
      this.usuarioService.getIngresosSuma(id.id).subscribe({
        next: (res) => {
          this.ingregosTotal = res.montoTotal;
          this.balance = signal(this.ingregosTotal - this.gastosTotal);
          this.cdr.detectChanges();
        }
      });
    }
  });
  // ✅ Elimina el cargarDatosGrafica de aquí
}

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  logout(): void {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  navigateTo(section: string): void {
    console.log('Navegando a:', section);
    this.router.navigate([section]);
  }

  updateBalance(newBalance: number): void {
    this.balance.set(newBalance);
  }

  // Métodos para Modal de Ingreso
  openIngresoModal(): void {
    this.showIngresoModal = true;
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  closeIngresoModal(): void {
    this.showIngresoModal = false;
    this.ingreso.set({
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      monto: 0,
      idUsuario: 1
    });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  updateIngresoField(field: keyof Ingreso, value: any): void {
    this.ingreso.update(i => ({ ...i, [field]: value }));
  }

  onSubmitIngreso(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const ing = this.ingreso();


    if (!ing.descripcion || !ing.fecha || ing.monto <= 0) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }
    
    this.isLoading = true;
    const payload = {
      descripcion: ing.descripcion,
      fecha: new Date(ing.fecha).toISOString(),
      monto: ing.monto,
      idUsuario: this.idUsuario
    };
    console.log(payload);
    this.http.post(this.apiI+"CrearIngreso",payload).subscribe({
      next:(res)=>{
        setTimeout(() => {
        this.successMessage.set('¡Ingreso registrado exitosamente!'+res);
        this.isLoading = false;

      // Limpiar formulario
      setTimeout(() => {
        this.ingreso.set({
          descripcion: '',
          fecha: new Date().toISOString().split('T')[0],
          monto: 0,
          idUsuario: 1
        });
        this.successMessage.set('');
      }, 2000);
    }, 3000);
    this.cdr.detectChanges();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  // Métodos para Modal de Gasto
  openGastoModal(): void {
    this.showGastoModal = true;
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  closeGastoModal(): void {
    this.showGastoModal = false;
    this.gasto.set({
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      monto: 0,
      categoria: '',
      idUsuario: 1
    });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  updateGastoField(field: keyof Gasto, value: any): void {
    this.gasto.update(g => ({ ...g, [field]: value }));
  }

  onSubmitGasto(): void {
    console.log("prueba que funciona");
    this.errorMessage.set('');
    this.successMessage.set('');

    const gas = this.gasto();

    if (!gas.descripcion || !gas.fecha || gas.monto <= 0 || !gas.categoria) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;

    const payload = {
      descripcion: gas.descripcion,
      categoria: gas.categoria,
      fecha: new Date(gas.fecha).toISOString(),
      monto: gas.monto,
      idUsuario: this.idUsuario
    };

    this.http.post(this.apiG+"CrearGasto", payload).subscribe({
      next:(res)=>{
        setTimeout(() => {
        this.successMessage.set('¡Gasto registrado exitosamente!'+res);
        this.isLoading = false;

      // Limpiar formulario
      setTimeout(() => {
        this.gasto.set({
          descripcion: '',
          fecha: new Date().toISOString().split('T')[0],
          categoria:'',
          monto: 0,
          idUsuario: 1
        });
        this.successMessage.set('');
      }, 2000);
    }, 3000);
    this.cdr.detectChanges();
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
}