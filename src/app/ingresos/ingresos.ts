import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Ingreso {
  descripcion: string;
  fecha: string;
  monto: number;
  idUsuario: number;
}

@Component({
  selector: 'app-agregar-ingreso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'ingresos.html',
  styleUrls: ['ingresos.css']
})
export class AgregarIngreso {
  menuOpen = signal(false);
  
  ingreso = signal<Ingreso>({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: 0,
    idUsuario: 1 // Esto vendría del usuario logueado
  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/login']);
    }
  }

  updateField(field: keyof Ingreso, value: any): void {
    this.ingreso.update(i => ({ ...i, [field]: value }));
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const ing = this.ingreso();

    // Validaciones
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
    }, 1000);
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