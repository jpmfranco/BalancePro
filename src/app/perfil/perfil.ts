import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Usuario {
  id: number;
  nombre: string;
  genero: string;
  edad: number;
  correo: string;
  celular: string;
  contrasena: string;
  fechaRegistro: string;
  activo: boolean;
}

interface EstadisticasUsuario {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  totalTransacciones: number;
  diasRegistrado: number;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  menuOpen = signal(false);
  isEditing = signal(false);
  isChangingPassword = signal(false);

  // Datos del usuario (simulados - vendrían del backend)
  usuario = signal<Usuario>({
    id: 1,
    nombre: 'Juan Pérez',
    genero: 'Masculino',
    edad: 28,
    correo: 'juan.perez@email.com',
    celular: '3331234567',
    contrasena: '******',
    fechaRegistro: '2024-01-15',
    activo: true
  });

  // Copia para edición
  usuarioEdit = signal<Usuario>({ ...this.usuario() });

  // Contraseñas
  contrasenaActual = signal('');
  contrasenaNueva = signal('');
  confirmarContrasena = signal('');

  // Estadísticas (simuladas)
  estadisticas = signal<EstadisticasUsuario>({
    totalIngresos: 45230.50,
    totalGastos: 32780.25,
    balance: 12450.25,
    totalTransacciones: 156,
    diasRegistrado: 320
  });

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  // Computed para días desde registro
  diasRegistrado = computed(() => {
    const fechaReg = new Date(this.usuario().fechaRegistro);
    const hoy = new Date();
    const diff = hoy.getTime() - fechaReg.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioSesion = sessionStorage.getItem('usuario');
    if (!usuarioSesion) {
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

  // Modo edición
  startEdit(): void {
    this.usuarioEdit.set({ ...this.usuario() });
    this.isEditing.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.usuarioEdit.set({ ...this.usuario() });
    this.errorMessage.set('');
  }

  updateEditField(field: keyof Usuario, value: any): void {
    this.usuarioEdit.update(u => ({ ...u, [field]: value }));
  }

  saveProfile(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const u = this.usuarioEdit();

    // Validaciones
    if (!u.nombre || !u.correo) {
      this.errorMessage.set('Nombre y correo son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(u.correo)) {
      this.errorMessage.set('Correo electrónico inválido');
      return;
    }

    if (u.edad && (u.edad < 18 || u.edad > 120)) {
      this.errorMessage.set('Edad debe estar entre 18 y 120');
      return;
    }

    this.isLoading.set(true);

    // Simular guardado (aquí iría tu llamada al API)
    setTimeout(() => {
      this.usuario.set({ ...u });
      this.successMessage.set('¡Perfil actualizado exitosamente!');
      this.isLoading.set(false);
      this.isEditing.set(false);

      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }, 1000);
  }

  // Cambiar contraseña
  openChangePassword(): void {
    this.isChangingPassword.set(true);
    this.contrasenaActual.set('');
    this.contrasenaNueva.set('');
    this.confirmarContrasena.set('');
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelChangePassword(): void {
    this.isChangingPassword.set(false);
    this.contrasenaActual.set('');
    this.contrasenaNueva.set('');
    this.confirmarContrasena.set('');
    this.errorMessage.set('');
  }

  savePassword(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.contrasenaActual() || !this.contrasenaNueva() || !this.confirmarContrasena()) {
      this.errorMessage.set('Todos los campos son obligatorios');
      return;
    }

    if (this.contrasenaNueva().length < 6) {
      this.errorMessage.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.contrasenaNueva() !== this.confirmarContrasena()) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);

    // Simular cambio de contraseña (aquí iría tu llamada al API)
    setTimeout(() => {
      this.successMessage.set('¡Contraseña actualizada exitosamente!');
      this.isLoading.set(false);
      this.isChangingPassword.set(false);
      this.contrasenaActual.set('');
      this.contrasenaNueva.set('');
      this.confirmarContrasena.set('');

      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }, 1000);
  }

  // Desactivar cuenta
  deactivateAccount(): void {
    const confirmar = confirm('¿Estás seguro de que deseas desactivar tu cuenta? Podrás reactivarla más tarde.');
    
    if (confirmar) {
      this.isLoading.set(true);

      setTimeout(() => {
        this.usuario.update(u => ({ ...u, activo: false }));
        this.successMessage.set('Cuenta desactivada. Cerrando sesión...');
        this.isLoading.set(false);

        setTimeout(() => {
          this.logout();
        }, 2000);
      }, 1000);
    }
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}