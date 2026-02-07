import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresos',
  imports: [],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css',
})
export class Ingresos {
  constructor(private router:Router){}
  back(){
    this.router.navigate(['']);
  }
}
