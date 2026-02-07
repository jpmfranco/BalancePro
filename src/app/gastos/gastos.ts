import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../enviroment/enviroment';

@Component({
  selector: 'app-gastos',
  imports: [],
  templateUrl: './gastos.html',
  styleUrl: './gastos.css',
})
export class Gastos {
  apiG = environment.apiGasto;
  product = '';
  Monto = 0;
  mes = ''
  ListMes: string[] = ['enero','febrero','marzo','abril','mayo','junio','julio',
                        'agosto','septiembre','octubre','noviembre','diciembre']
  constructor(private http:HttpClient,private router:Router){}
  back(){
    this.router.navigate(['']);
  }

  CrearGasto(){
    // this.http.post(this.apiG+'CrearGasto')
  }
}
