import { Routes } from '@angular/router';

import { Login } from './components/auth/login/login';
import { Registration } from './components/auth/registration/registration';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Registration,
  },
];
