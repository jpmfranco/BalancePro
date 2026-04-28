import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
      const json = {
        correo: this.correo(),
        contraseña: this.password()
      }
      console.log(json);
      const filter = this.users.filter((f:any)=>f.correo = json.correo);
      if(filter.length != 0){
        sessionStorage.setItem('usuario', this.correo());
        this.router.navigate(['overview']);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos');
      }
      this.isLoading.set(false);
    }, 1000);
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