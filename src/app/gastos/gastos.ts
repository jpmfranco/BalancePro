import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment/enviroment';

interface Gasto {
  descripcion: string;
  fecha: string;
  monto: number;
  categoria: string;
  idUsuario: number;
}

@Component({
  selector: 'app-agregar-gasto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'gastos.html',
  styleUrls: ['gastos.css']
})
export class AgregarGasto {
  menuOpen = signal(false);
  
  gasto = signal<Gasto>({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: 0,
    categoria: '',
    idUsuario: 1 // Esto vendría del usuario logueado
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

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    }
  }

  updateField(field: keyof Gasto, value: any): void {
    this.gasto.update(g => ({ ...g, [field]: value }));
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const gas = this.gasto();

    // Validaciones
    if (!gas.descripcion || !gas.fecha || gas.monto <= 0 || !gas.categoria) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);

    // Preparar el payload con la fecha en formato ISO
    const payload = {
      descripcion: gas.descripcion,
      categoria: gas.categoria,
      fecha: new Date(gas.fecha).toISOString(),
      monto: gas.monto,
      idUsuario: gas.idUsuario
    };

    // Llamada al API
    this.http.post(`${environment.apiGasto}/CrearGasto`, payload).subscribe({
      next: (response) => {
        console.log('Gasto registrado:', response);
        this.successMessage.set('¡Gasto registrado exitosamente!');
        this.isLoading.set(false);

        // Limpiar formulario
        setTimeout(() => {
          this.gasto.set({
            descripcion: '',
            fecha: new Date().toISOString().split('T')[0],
            monto: 0,
            categoria: '',
            idUsuario: 1
          });
          this.successMessage.set('');
        }, 2000);
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
}