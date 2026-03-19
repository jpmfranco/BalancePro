import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home implements OnInit{
  ingresos = ['hola']
  egresos = ['Egresos']

  variable:any = []

  ngOnInit(): void {
    this.variable = 3;
  }
  //   toggleMenu(): void {
  //   this.menuOpen.update(value => !value);
  // }

  // logout(): void {
  //   sessionStorage.removeItem('usuario');
  //   this.usuario.set('');
  //   this.router.navigate(['/login']);
  // }

  // navigateTo(section: string): void {
  //   console.log('Navegando a:', section);
  //   this.router.navigate([section]);
  // }

  // updateBalance(newBalance: number): void {
  //   this.balance.set(newBalance);
  // }
}
