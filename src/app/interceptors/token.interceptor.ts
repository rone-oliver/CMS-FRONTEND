import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, take } from 'rxjs';

import { environment } from '../../environments/environment';
import { Auth } from '../services/auth.service';
import { Token } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const auth = inject(Auth);
  const isAuthRoute = req.url.startsWith(`${environment.BACKEND_URL}/auth`);

  if (!isAuthRoute) {
    const token = tokenService.getToken();
    if (!token) {
      // Must subscribe, otherwise logout won't execute
      auth.logout().pipe(take(1)).subscribe();
      return throwError(() => new Error('No token found. User logged out.'));
    }
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  }
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isAuthRoute || err.status !== 401) return throwError(() => err);

      if (err.status === 401 && err.error?.isAccessTokenExpired) {
        const refresh$ = auth.refreshToken().pipe(
          catchError((e: HttpErrorResponse) => {
            if (e.status === 401 && e.error?.isRefreshTokenExpired) {
              auth.logout().pipe(take(1)).subscribe();
            } else {
              // Any refresh failure -> force logout to clear invalid session
              auth.logout().pipe(take(1)).subscribe();
            }
            return throwError(() => e);
          }),
        );
        return refresh$.pipe(
          switchMap(() => {
            const retried = req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokenService.getToken()}`,
              },
              withCredentials: true,
            });
            return next(retried);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
