import 'zone.js';
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
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

  constructor(private router: Router) {}

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
  }

  updateBalance(newBalance: number): void {
    this.balance.set(newBalance);
  }
}