import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Adjunta el JWT de sessionStorage a cada petición y, ante 401 en una
// ruta protegida (token ausente/expirado), limpia la sesión y vuelve a /login.
// Las rutas públicas (login/registro) se excluyen del logout para no
// romper sus mensajes de error.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  const isPublic = /\/api\/(Auth\/login|Usuarios\/CrearUsuario)/i.test(req.url);
  const authReq = token && !isPublic ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isPublic && sessionStorage.getItem('token')) {
        sessionStorage.clear();
        const url = router.url;
        if (url !== '/login' && url !== '/registro') {
          router.navigate(['/login']);
        }
      }
      return throwError(() => err);
    })
  );
};
