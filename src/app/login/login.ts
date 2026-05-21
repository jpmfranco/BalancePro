import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment/enviroment';
import { UsuarioService } from '../Services/usuario-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit{
  apiU = environment.apiUsuario;
  users:any = [];
  correo = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router,private http:HttpClient, private usuarioService:UsuarioService) {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
      this.router.navigate(['/overview']);
    }
  }

  ngOnInit(): void {
    this.ObtenerUsuarios();
  }
  ObtenerUsuarios(){
    this.usuarioService.getUsers().subscribe({
      next:(res)=>{
        this.users = res;
      }
    });
  }
  onSubmit(): void {
    this.errorMessage.set('');
    
    if (!this.correo().trim() || !this.password().trim()) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      const correoIngresado = this.correo().trim().toLowerCase();
      const passwordIngresada = this.password().trim();

      // Buscar usuario por correo Y contraseña (comparación correcta con ===)
      const usuarioEncontrado = this.users.find(
        (f: any) =>
          f.correo?.toLowerCase() === correoIngresado &&
          f.contrasena === passwordIngresada
      );

      if (usuarioEncontrado) {
        // Guardar el objeto completo para que otros componentes puedan leer el ID
        sessionStorage.setItem('usuario', this.correo());
        this.router.navigate(['overview']);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos');
      }
      this.isLoading.set(false);
    }, 1000);
  }
  GotoRegister(){
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