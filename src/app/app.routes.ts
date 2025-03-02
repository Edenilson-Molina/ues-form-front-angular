import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/modules/home/home.component')
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/modules/auth/views/login-page/login-page.component')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./presentation/layouts/dashboard/dashboard.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./presentation/modules/home/home.component')
      },
      {
        path: 'test',
        loadComponent: () => import('./presentation/modules/test/test.component')
      }
    ]
  }
];
