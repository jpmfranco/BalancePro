import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment/enviroment';

interface PerfilDto {
  Perfil: number;
  Estabilidad: number;
  Categoria: number;
  TendIngresos: number;
  TendEgresos: number;
  Control: number;
  Planificacion: number;
}

@Component({
  selector: 'app-perfil-financiero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-financiero.html',
  styleUrls: ['./perfil-financiero.css']
})
export class PerfilFinanciero {
  perfil = signal<PerfilDto>({
    Perfil: 1,
    Estabilidad: 1,
    Categoria: 0,
    TendIngresos: 0,
    TendEgresos: 0,
    Control: 3,
    Planificacion: 3
  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router, private http: HttpClient) {}

  updateField(field: keyof PerfilDto, value: number): void {
    this.perfil.update(p => ({ ...p, [field]: value }));
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.errorMessage.set('No se encontró el usuario. Por favor regístrate de nuevo.');
      return;
    }

    this.isLoading.set(true);

    this.http.post(`${environment.apiIA}analizar/${userId}`, this.perfil()).subscribe({
      next: () => {
        this.successMessage.set('¡Perfil financiero creado! Redirigiendo...');
        this.isLoading.set(false);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al analizar perfil:', err);
        this.errorMessage.set('Error al procesar el perfil. Por favor intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  omitir(): void {
    this.router.navigate(['/login']);
  }
}
