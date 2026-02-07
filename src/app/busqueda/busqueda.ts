import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Transaction {
  fecha: string;
  nombre: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
}

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busqueda.html',
  styleUrls: ['./busqueda.css']
})
export class Busqueda implements OnInit {
  menuOpen = signal(false);
  searchText = signal('');
  showIngresos = signal(true);
  showEgresos = signal(true);
  dropdownOpen = signal(false);

  // Datos de transacciones
  allTransactions: Transaction[] = [
    { fecha: '2024-09-12', nombre: 'Venta mostrador', tipo: 'Ingreso', monto: 1800 },
    { fecha: '2024-09-18', nombre: 'Pago proveedor', tipo: 'Egreso', monto: 950 },
    { fecha: '2024-10-03', nombre: 'Servicio mensual', tipo: 'Ingreso', monto: 2300 },
    { fecha: '2024-10-10', nombre: 'Compra insumos', tipo: 'Egreso', monto: 1120 },
    { fecha: '2024-11-02', nombre: 'Proyecto cliente X', tipo: 'Ingreso', monto: 4500 },
    { fecha: '2024-11-15', nombre: 'Pago servicios', tipo: 'Egreso', monto: 780 },
    { fecha: '2024-11-20', nombre: 'Consultoría', tipo: 'Ingreso', monto: 3200 },
    { fecha: '2024-12-01', nombre: 'Renta oficina', tipo: 'Egreso', monto: 2500 },
    { fecha: '2024-12-05', nombre: 'Venta producto A', tipo: 'Ingreso', monto: 1950 },
    { fecha: '2024-12-10', nombre: 'Mantenimiento', tipo: 'Egreso', monto: 650 }
  ];

  // Computed signal para filtrar transacciones
  filteredTransactions = computed(() => {
    const search = this.searchText().toLowerCase();
    const showIng = this.showIngresos();
    const showEgr = this.showEgresos();

    return this.allTransactions.filter(transaction => {
      // Filtro por tipo
      if (transaction.tipo === 'Ingreso' && !showIng) return false;
      if (transaction.tipo === 'Egreso' && !showEgr) return false;

      // Filtro por búsqueda
      if (search) {
        const matchesSearch = 
          transaction.fecha.toLowerCase().includes(search) ||
          transaction.nombre.toLowerCase().includes(search) ||
          transaction.tipo.toLowerCase().includes(search) ||
          transaction.monto.toString().includes(search);
        return matchesSearch;
      }

      return true;
    });
  });

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

  toggleDropdown(): void {
    this.dropdownOpen.update(value => !value);
  }

  logout(): void {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  navigateTo(section: string): void {
    this.router.navigate([`/${section}`]);
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
  }

  toggleIngresos(): void {
    this.showIngresos.update(value => !value);
  }

  toggleEgresos(): void {
    this.showEgresos.update(value => !value);
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  viewDetails(transaction: Transaction): void {
    console.log('Ver detalles de:', transaction);
    alert(`Detalles:\nFecha: ${transaction.fecha}\nNombre: ${transaction.nombre}\nTipo: ${transaction.tipo}\nMonto: ${this.formatCurrency(transaction.monto)}`);
  }
}