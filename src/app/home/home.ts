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
}
