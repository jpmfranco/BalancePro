import 'zone.js';
import { Component, OnInit, signal, computed } from '@angular/core';
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
  balance = signal(12450.00);
  menuOpen = signal(false);
  usuario = signal('');

  // Modales
  showIngresoModal = signal(false);
  showGastoModal = signal(false);
  isLoading = signal(false);
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

  formattedBalance = computed(() =>
    '$' + this.balance().toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );

  // Configuración de ApexCharts - SIN ERRORES
  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Ingresos',
        data: [1200, 800, 1500, 900, 2000, 500, 1000]
      },
      {
        name: 'Egresos',
        data: [600, 900, 700, 1100, 800, 400, 900]
      }
    ],
    chart: {
      height: 400,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    colors: ['#5DADE2', '#EC7063'],
    markers: {
      size: 4,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      labels: {
        style: {
          colors: '#666',
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 2200,
      tickAmount: 11,
      labels: {
        style: {
          colors: '#666',
          fontSize: '11px'
        },
        formatter: (value) => {
          return value.toLocaleString();
        }
      }
    },
    grid: {
      borderColor: 'rgba(0, 0, 0, 0.06)',
      strokeDashArray: 0
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      itemMargin: {
        horizontal: 15,
        vertical: 5
      }
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

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    } else {
      this.usuario.set(usuario);
      console.log('✅ Overview cargado - Usuario:', usuario);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  logout(): void {
    sessionStorage.removeItem('usuario');
    this.usuario.set('');
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
    this.showIngresoModal.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  closeIngresoModal(): void {
    this.showIngresoModal.set(false);
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

    this.isLoading.set(true);

    // Simular guardado (aquí iría tu llamada al API)
    setTimeout(() => {
      console.log('Ingreso registrado:', this.ingreso());
      this.successMessage.set('¡Ingreso registrado exitosamente!');
      this.isLoading.set(false);

      setTimeout(() => {
        this.closeIngresoModal();
      }, 1500);
    }, 1000);
  }

  // Métodos para Modal de Gasto
  openGastoModal(): void {
    this.showGastoModal.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  closeGastoModal(): void {
    this.showGastoModal.set(false);
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
    this.errorMessage.set('');
    this.successMessage.set('');

    const gas = this.gasto();

    if (!gas.descripcion || !gas.fecha || gas.monto <= 0 || !gas.categoria) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);

    const payload = {
      descripcion: gas.descripcion,
      categoria: gas.categoria,
      fecha: new Date(gas.fecha).toISOString(),
      monto: gas.monto,
      idUsuario: gas.idUsuario
    };

    this.http.post(`${environment.apiGasto}/CrearGasto`, payload).subscribe({
      next: (response) => {
        console.log('Gasto registrado:', response);
        this.successMessage.set('¡Gasto registrado exitosamente!');
        this.isLoading.set(false);

        setTimeout(() => {
          this.closeGastoModal();
        }, 1500);
      },
      error: (error) => {
        console.error('Error al registrar gasto:', error);
        this.errorMessage.set(
          error.error?.message || 'Error al guardar el gasto. Intenta nuevamente.'
        );
        this.isLoading.set(false);
      }
    });
  }
}