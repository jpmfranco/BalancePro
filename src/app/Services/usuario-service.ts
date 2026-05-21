import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUsuario;
  private apiG = environment.apiGasto;
  private apiI = environment.apiIngreso;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}ObtenerUsuarios`);
  }

  updateUser(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}EditarUsuario/${id}`, usuario);
  }

  updatePassword(id: number, passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}CambiarContrasena/${id}`, passwordData);
  }
  getGastos():Observable<any>{
    return this.http.get(`${this.apiG}ObtenerGasto`);
  }
  getGIngresos():Observable<any>{
    return this.http.get(`${this.apiI}ObtenerIngreso`);
  }
  getGastosPorUsuario(id: number):Observable<any>{
    return this.http.get(`${this.apiG}ObtenerGastoporID/${id}`);
  }
  getIngresosPorUsuario(id: number):Observable<any>{
    return this.http.get(`${this.apiI}ObtenerIngresoporID/${id}`);
  }
  getGastosSuma(id: number):Observable<any>{
    return this.http.get(`${this.apiG}ObtenerSumaTotal`, { params: { id: id.toString() } });
  }
  getIngresosSuma(id: number):Observable<any>{
    return this.http.get(`${this.apiI}ObtenerSumaTotal`, { params: { id: id.toString() } });
  }
}
