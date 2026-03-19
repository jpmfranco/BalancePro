import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UsuarioRegistro {
  nombre: string;
  genero: string;
  edad: number;
  correo: string;
  celular: string;
  contrasena: string;
  confirmarContrasena: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  usuario = signal<UsuarioRegistro>({
    nombre: '',
    genero: '',
    edad: 0,
    correo: '',
    celular: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router) {}

  updateField(field: keyof UsuarioRegistro, value: any): void {
    this.usuario.update(u => ({ ...u, [field]: value }));
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validaciones
    const u = this.usuario();

    if (!u.nombre || !u.correo || !u.contrasena) {
      this.errorMessage.set('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (u.contrasena !== u.confirmarContrasena) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (u.contrasena.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(u.correo)) {
      this.errorMessage.set('Correo electrónico inválido');
      return;
    }

    this.isLoading.set(true);

    // Simular registro (aquí iría tu llamada al API)
    setTimeout(() => {
      console.log('Usuario registrado:', this.usuario());
      this.successMessage.set('¡Cuenta creada exitosamente!');
      this.isLoading.set(false);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1500);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}