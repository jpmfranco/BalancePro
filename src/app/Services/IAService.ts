import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  // Asegúrate de que este puerto sea el que sale cuando haces 'dotnet run'
  private apiUrl = environment.apiIA;

  constructor(private http: HttpClient) { }

  obtenerAnalisisIA(usuarioId: number): Observable<any> {
    // Intenta quitar o poner "api/" dependiendo de lo que viste en Swagger
    // Si en Swagger viste que la ruta empieza directo en /IA, quita el "api/"
    return this.http.get(`${this.apiUrl}analizar/${usuarioId}`);
  }
}