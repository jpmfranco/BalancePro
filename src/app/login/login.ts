import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router) {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
      this.router.navigate(['/overview']);
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');
    
    if (!this.username().trim() || !this.password().trim()) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      if (this.username() === 'admin' && this.password() === 'admin123') {
        sessionStorage.setItem('usuario', this.username());
        console.log('✅ Login exitoso');
        this.router.navigate(['']);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos');
        console.log('❌ Login fallido');
      }
      this.isLoading.set(false);
    }, 1000);
  }

  clearError(): void {
    this.errorMessage.set('');
  }

  updateUsername(value: string): void {
    this.username.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }
}