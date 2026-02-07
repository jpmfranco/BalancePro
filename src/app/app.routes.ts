import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Gastos } from './gastos/gastos';
import { Ingresos } from './ingresos/ingresos';
import { Login } from './login/login';
import { Overview } from './overview/overview';
import { Proyeccion } from './prediccion/prediccion';
import { Busqueda } from './busqueda/busqueda';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: '', component: Overview},
    { path: 'login', component:Login},
    { path: 'busqueda', component:Busqueda},
    { path: 'prediccion', component:Proyeccion},
    { path: 'gastos', component: Gastos},
    { path: 'ingresos', component: Ingresos },

];
