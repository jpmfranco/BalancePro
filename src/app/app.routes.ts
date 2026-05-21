import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Overview } from './overview/overview';
import { Proyeccion } from './proyección/proyeccion';
import { Busqueda } from './busqueda/busqueda';
import { Perfil } from './perfil/perfil';
import { PerfilFinanciero } from './perfil-financiero/perfil-financiero';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'perfil-financiero', component: PerfilFinanciero },
  { path: 'overview', component: Overview },
  { path: 'proyeccion', component: Proyeccion },
  { path: 'busqueda', component: Busqueda },
  { path: 'perfil', component: Perfil },
  { path: '**', redirectTo: '/login' }
];