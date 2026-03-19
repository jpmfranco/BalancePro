import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Overview } from './overview/overview';
import { Proyeccion } from './proyección/proyeccion';
import { Busqueda } from './busqueda/busqueda';
import { AgregarIngreso } from './ingresos/ingresos';
import { AgregarGasto } from './gastos/gastos';
import { Perfil } from './perfil/perfil';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'overview', component: Overview },
  { path: 'proyeccion', component: Proyeccion },
  { path: 'busqueda', component: Busqueda },
  { path: 'agregar-ingreso', component: AgregarIngreso },
  { path: 'agregar-gasto', component: AgregarGasto },
    { path: 'perfil', component: Perfil },
  { path: '**', redirectTo: '/login' }
];