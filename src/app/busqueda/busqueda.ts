import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../Services/usuario-service';
import { forkJoin } from 'rxjs';

interface Transaction {
  fecha: string;
  nombre: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
}

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  allTransactions = signal<Transaction[]>([]);
  usuarioId: number = 0;
  selectedTransaction: Transaction | null = null;
  ismodale:boolean = false;
  // Computed signal para filtrar transacciones
  filteredTransactions = computed(() => {
    const search = this.searchText().toLowerCase();
    const showIng = this.showIngresos();
    const showEgr = this.showEgresos();

    return this.allTransactions().filter(transaction => {
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

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    } else {
      this.loadUserData(usuario);
    }
  }

  loadUserData(correo: string): void {
    // Primero obtener todos los usuarios para encontrar el ID del usuario actual
    this.usuarioService.getUsers().subscribe({
      next: (users) => {
        const currentUser = users.find((u: any) => u.correo === correo);
        if (currentUser) {
          this.usuarioId = currentUser.id;
          this.loadTransactions();
        }
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  loadTransactions(): void {
    // Cargar gastos e ingresos en paralelo
    forkJoin({
      gastos: this.usuarioService.getGastosPorUsuario(this.usuarioId),
      ingresos: this.usuarioService.getIngresosPorUsuario(this.usuarioId)
    }).subscribe({
      next: (result) => {
        // Transformar gastos
        const gastos: Transaction[] = result.gastos.map((gasto: any) => ({
          fecha: gasto.fecha || gasto.fechaGasto || '',
          nombre: gasto.descripcion || 'Gasto',
          tipo: 'Egreso' as const,
          monto: gasto.monto || gasto.cantidad || 0
        }));

        // Transformar ingresos
        const ingresos: Transaction[] = result.ingresos.map((ingreso: any) => ({
          fecha: ingreso.fecha,
          nombre:  ingreso.descripcion || 'Ingreso',
          tipo: 'Ingreso' as const,
          monto: ingreso.monto || 0
        }));

        // Combinar y ordenar por fecha (más recientes primero)
        const transactions = [...gastos, ...ingresos].sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

        this.allTransactions.set(transactions);
        console.log('Transacciones cargadas:', this.allTransactions());
      },
      error: (err) => {
        console.error('Error al cargar transacciones:', err);
      }
    });
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
    this.ismodale = true;
    this.selectedTransaction = transaction;
  }

closeModal(): void {
  this.selectedTransaction = null;
}
}