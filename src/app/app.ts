import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ingresos = ['hola']
  egresos = ['Egresos']
  protected readonly title = signal('AppEcono');
}
