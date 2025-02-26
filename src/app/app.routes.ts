import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/modules/home/home.component')
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/modules/auth/views/login-page/login-page.component')
  }
];
