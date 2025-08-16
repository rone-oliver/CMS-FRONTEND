import { Routes } from '@angular/router';

import { Login } from './components/auth/login/login';
import { Registration } from './components/auth/registration/registration';
import { UserLayout } from './components/layouts/user-layout/user-layout';
import { authGuard, guestGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Registration,
    canActivate: [guestGuard],
  },
  {
    path: 'user',
    component: UserLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/user/dashboard/dashboard').then(
            (m) => m.Dashboard,
          ),
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./components/user/articles/articles').then(
            (m) => m.UserArticles,
          ),
      },
      {
        path: 'articles/:id',
        loadComponent: () =>
          import('./components/user/article/article').then((m) => m.Article),
      },
    ],
  },
  {
    path: '**', redirectTo: 'login'
  },
];
