import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from './guards/redirectIfAuthenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [RedirectIfAuthenticatedGuard],
    loadComponent: () => import('./presentation/modules/auth/views/login-page/login-page.component')
  },
  {
    path: 'request-register',
    canActivate: [RedirectIfAuthenticatedGuard],
    loadComponent: () => import('./presentation/modules/auth/views/request-register-page/request-register-page.component')
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./presentation/layouts/dashboard/dashboard.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./presentation/modules/home/home.component')
      },
      {
        path: 'survy',
        loadComponent: () => import('./presentation/modules/survy/home-survy/home-survy.component')
      },
      {
        path: 'survy/form-editor/:formId',
        loadComponent: () => import('./presentation/modules/survy/form-editor/form-editor.component')
      },
      {
        path: 'test',
        loadComponent: () => import('./presentation/modules/test/test.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./presentation/modules/users/views/user-page/user-page.component')
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
