import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Token } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(Token);
  const router = inject(Router);
  const token = tokenService.getToken();

  if (token) return true;
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const guestGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(Token);
  const router = inject(Router);
  const token = tokenService.getToken();

  if (token) {
    return router.createUrlTree(['/user/dashboard']);
  }
  return true;
};
