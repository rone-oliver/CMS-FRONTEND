import { Routes } from '@angular/router';

import { Login } from './components/auth/login/login';
import { Registration } from './components/auth/registration/registration';
import { Dashboard } from './components/user/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { UserLayout } from './components/layouts/user-layout/user-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Registration,
  },
  {
    path: 'user',
    component: UserLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/user/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./components/user/articles/articles').then((m) => m.UserArticles),
      },
      {
        path: 'articles/:id',
        loadComponent: () => 
          import('./components/user/article/article').then((m) => m.Article),
      }
    ]
  },
];
