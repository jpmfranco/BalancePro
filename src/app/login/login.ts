import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment/enviroment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  correo = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router, private http: HttpClient) {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
      this.router.navigate(['/overview']);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.correo().trim() || !this.password().trim()) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    this.http.post<any>(`${environment.apiUrl}/api/Auth/login`, {
      correo: this.correo().trim().toLowerCase(),
      contrasena: this.password().trim()
    }).subscribe({
      next: (response) => {
        // Guardar datos en sessionStorage
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('usuario', response.usuario.nombre);
        sessionStorage.setItem('userId', response.usuario.id.toString());
        sessionStorage.setItem('correo', response.usuario.correo);

        this.isLoading.set(false);
        this.router.navigate(['/overview']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Usuario o contraseña incorrectos');
        } else if (err.status === 0) {
          this.errorMessage.set('No se puede conectar al servidor');
        } else {
          this.errorMessage.set('Error al iniciar sesión');
        }
      }
    });
  }

  GotoRegister() {
    this.router.navigate(['registro']);
  }

  clearError(): void {
    this.errorMessage.set('');
  }

  updatecorreo(value: string): void {
    this.correo.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }
}