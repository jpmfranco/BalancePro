import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../Services/usuario-service';

interface Usuario {
  id: number;
  nombre: string;
  genero: string;
  edad: number;
  correo: string;
  celular: number;
  contrasena: string;
  fechaRegistro: string;
  activo: boolean;
}

interface EstadisticasUsuario {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  totaltransGasto:number;
  totaltransIngreso:number;
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
  menuOpen = false;
  isEditing = false;
  isChangingPassword = false;

  // Datos del usuario
  usuario: Usuario = {
    id: 0,
    nombre: '',
    genero: '',
    edad: 0,
    correo: '',
    celular: 0,
    contrasena: '',
    fechaRegistro: '',
    activo: true
  };

  // Copia para edición
  usuarioEdit: Usuario = { ...this.usuario };

  // Contraseñas
  contrasenaActual = '';
  contrasenaNueva = '';
  confirmarContrasena = '';

  // Estadísticas (simuladas)
  estadisticas: EstadisticasUsuario = {
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    totaltransGasto: 0,
    totaltransIngreso:0,
    totalTransacciones: 0,
    diasRegistrado: 0
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  // Método para días desde registro
  get diasRegistrado(): number {
    const fechaReg = new Date(this.usuario.fechaRegistro);
    const hoy = new Date();
    const diff = hoy.getTime() - fechaReg.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioSesion = sessionStorage.getItem('usuario');
    if (!usuarioSesion) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Obtener información del usuario desde el backend
    this.cargarDatosUsuario(usuarioSesion);
   
  }
  cargarDatosFinancierosUsuario(user:any){
    this.usuarioService.getGastosSuma(user.id).subscribe({
      next:(res)=>{
        this.estadisticas.totalGastos = res.montoTotal;
        this.estadisticas.totaltransGasto = res.totaltrans;
        this.usuarioService.getIngresosSuma(user.id).subscribe({
      next:(res)=>{
        this.estadisticas.totalIngresos = res.montoTotal;
        this.estadisticas.totaltransIngreso = res.totaltrans;
        this.estadisticas.totalTransacciones = this.estadisticas.totaltransIngreso +this.estadisticas.totaltransGasto;
        this.estadisticas.balance = this.estadisticas.totalIngresos - this.estadisticas.totalGastos;
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.error('Error al cargar ingresos:', err);
      }
      });
        this.cdr.detectChanges();

      },
      error:(err)=>{
        console.error('Error al cargar gastos:', err);
      }
    });
    
    
  }
  cargarDatosUsuario(correo: string): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.usuarioService.getUsers().subscribe({
      next: (res) => {
        const usuarioEncontrado = res.find((u: Usuario) => u.correo === correo);
        if (usuarioEncontrado) {
          this.usuario = usuarioEncontrado;
          this.usuarioEdit = { ...usuarioEncontrado };
        } else {
          this.errorMessage = 'No se encontró el usuario';
          console.error('Usuario no encontrado con correo:', correo);
        }
        this.isLoading = false;
        this.cargarDatosFinancierosUsuario(this.usuario);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los datos del usuario';
        console.error('Error al obtener usuarios:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.cdr.detectChanges();
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
    this.usuarioEdit = { ...this.usuario };
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.usuarioEdit = { ...this.usuario };
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  updateEditField(field: keyof Usuario, value: any): void {
    this.usuarioEdit = { ...this.usuarioEdit, [field]: value };
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    
    const u = this.usuarioEdit;
    // Validaciones
    if (!u.nombre || !u.correo) {
      this.errorMessage = 'Nombre y correo son obligatorios';
      this.cdr.detectChanges();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(u.correo)) {
      this.errorMessage = 'Correo electrónico inválido';
      this.cdr.detectChanges();
      return;
    }

    if (u.edad && (u.edad < 18 || u.edad > 120)) {
      this.errorMessage = 'Edad debe estar entre 18 y 120';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const json = {
      id: u.id,
      nombre: u.nombre,
      genero: u.genero,
      edad: u.edad,
      correo: u.correo,
      celular: Number(u.celular),
      contrasena: u.contrasena,
      fechaRegistro: u.fechaRegistro,
      activo: u.activo
    }
    console.log(json,"sjson")
    // Llamar al API para actualizar el perfil
    this.usuarioService.updateUser(u.id, json).subscribe({
      next: (res) => {
        this.usuario = { ...u };
        // Si cambió el correo, actualizar el sessionStorage
        if (u.correo !== sessionStorage.getItem('usuario')) {
          sessionStorage.setItem('usuario', u.correo);
        }
        this.successMessage = '¡Perfil actualizado exitosamente!';
        this.isLoading = false;
        this.isEditing = false;
        this.cdr.detectChanges();
        console.log('Perfil actualizado:', res);

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar el perfil. Intenta de nuevo.';
        console.error('Error al actualizar perfil:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Cambiar contraseña
  openChangePassword(): void {
    this.isChangingPassword = true;
    this.contrasenaActual = '';
    this.contrasenaNueva = '';
    this.confirmarContrasena = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  cancelChangePassword(): void {
    this.isChangingPassword = false;
    this.contrasenaActual = '';
    this.contrasenaNueva = '';
    this.confirmarContrasena = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  savePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';
    console.log(this.contrasenaActual,this.confirmarContrasena,this.contrasenaNueva);
    if (!this.contrasenaActual || !this.contrasenaNueva || !this.confirmarContrasena) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.cdr.detectChanges();
      return;
    }

    if (this.contrasenaNueva.length < 6) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres';
      this.cdr.detectChanges();
      return;
    }

    if (this.contrasenaNueva !== this.confirmarContrasena) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const passwordData = {
      contrasenaActual: this.contrasenaActual,
      contrasenaNueva: this.contrasenaNueva
    };
  const u = this.usuarioEdit;
    // Llamar al API para cambiar la contraseña
    const json = {
      id: u.id,
      nombre: u.nombre,
      genero: u.genero,
      edad: u.edad,
      correo: u.correo,
      celular: Number(u.celular),
      contrasena: this.contrasenaNueva,
      fechaRegistro: u.fechaRegistro,
      activo: u.activo
    }
    console.log(json,"sjson")
    // Llamar al API para actualizar el perfil
    this.usuarioService.updateUser(u.id, json).subscribe({
      next: (res) => {
        this.usuario = { ...u };
        // Si cambió el correo, actualizar el sessionStorage
        if (u.correo !== sessionStorage.getItem('usuario')) {
          sessionStorage.setItem('usuario', u.correo);
        }
        this.successMessage = '¡Contraseña actualizada exitosamente!';
        this.isLoading = false;
        this.isEditing = false;
        this.cdr.detectChanges();
        console.log('Contraseña actualizada:', res);

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar la contraseña. Intenta de nuevo.';
        console.error('Error al actualizar contraseña:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Desactivar cuenta
  deactivateAccount(): void {
    const confirmar = confirm('¿Estás seguro de que deseas desactivar tu cuenta? Podrás reactivarla más tarde.');
    
    if (confirmar) {
      this.isLoading = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.usuario = { ...this.usuario, activo: false };
        this.successMessage = 'Cuenta desactivada. Cerrando sesión...';
        this.isLoading = false;
        this.cdr.detectChanges();

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