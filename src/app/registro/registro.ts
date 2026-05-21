import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment/enviroment';

interface UsuarioRegistro {
  nombre: string;
  genero: string;
  edad: number;
  correo: string;
  celular: string;
  contrasena: string;
  confirmarContrasena: string;
}

interface UsuarioAPI {
  nombre: string;
  edad: number;
  genero: string;
  correo: string;
  celular: number;
  contrasena: string;
  fechaRegistro: string;
  activo: boolean;
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

  constructor(private router: Router, private http: HttpClient) {}

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

    if (u.celular && !/^\d{10}$/.test(u.celular.toString())) {
      this.errorMessage.set('El número de celular debe tener exactamente 10 dígitos');
      return;
    }

    this.isLoading.set(true);

    const payload: UsuarioAPI = {
      nombre: u.nombre,
      edad: Number(u.edad),
      genero: u.genero,
      correo: u.correo,
      celular: Number(u.celular),
      contrasena: u.contrasena,
      fechaRegistro: new Date().toISOString(),
      activo: true
    };

    this.http.post<any>(`${environment.apiUsuario}CrearUsuario`, payload).subscribe({
      next: (respuesta) => {
        this.successMessage.set('¡Cuenta creada exitosamente! Configurando tu perfil...');
        this.isLoading.set(false);
        if (respuesta && respuesta.id) {
          localStorage.setItem('userId', respuesta.id.toString());
        }
        setTimeout(() => {
          this.router.navigate(['/perfil-financiero']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.errorMessage.set('Error al crear la cuenta. Por favor intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}