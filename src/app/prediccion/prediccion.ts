import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexDataLabels,
  ApexFill
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  fill: ApexFill;
};

interface MonthProjection {
  month: string;
  balance: number;
  isPositive: boolean;
}

interface Movement {
  concepto: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
}

@Component({
  selector: 'app-proyeccion',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './prediccion.html',
  styleUrls: ['./prediccion.css']
})
export class Proyeccion implements OnInit {
  menuOpen = signal(false);

  // Proyecciones mensuales
  monthlyProjections: MonthProjection[] = [
    { month: 'Mes 1', balance: 8500, isPositive: true },
    { month: 'Mes 2', balance: 9200, isPositive: true },
    { month: 'Mes 3', balance: 7900, isPositive: false }
  ];

  // Movimientos estimados
  movements: Movement[] = [
    { concepto: 'Ingreso freelance', tipo: 'Ingreso', monto: 3500 },
    { concepto: 'Renta oficina', tipo: 'Egreso', monto: -2800 },
    { concepto: 'Servicios', tipo: 'Egreso', monto: -1200 },
    { concepto: 'Proyecto cliente', tipo: 'Ingreso', monto: 4000 },
    { concepto: 'Transporte', tipo: 'Egreso', monto: -900 }
  ];

  // Configuración de la gráfica
  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Ingresos',
        data: [12000, 13500, 12800]
      },
      {
        name: 'Egresos',
        data: [3500, 4300, 4900]
      }
    ],
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    colors: ['#2e7d32', '#c62828'],
    xaxis: {
      categories: ['Mes 1', 'Mes 2', 'Mes 3']
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (value) => {
          return '$' + value.toLocaleString();
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.05
      }
    }
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  logout(): void {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  navigateTo(section: string): void {
    this.router.navigate([`/${section}`]);
  }

  formatCurrency(amount: number): string {
    const sign = amount >= 0 ? '+' : '';
    return sign + '$' + Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}