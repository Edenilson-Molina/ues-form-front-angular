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
    loadComponent: () => import('./presentation/layouts/dashboard/dashboard.component'),
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/home/home.component')
      },
      {
        path: 'survy/my-surveys',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/survy/home-survy/home-survy.component')
      },
      {
        path: 'survy/form-editor/:formId',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/survy/form-editor/form-editor.component')
      },
      {
        path: 'survy/catalogues/target-group',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/catalogues/target-group/target-group.component'),
      },
      {
        path: 'test',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/test/test.component')
      },
      {
        path: 'users/list',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/admin/views/users-management-page/users-management-page.component')
      },
      {
        path: 'users/request-register',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/admin/views/request-register-admin-page/request-register-admin-page.component')
      }
    ]
  },
  {
    path: 'survey/:id',
    loadComponent: () => import('./presentation/modules/survy/survy-view-page/survy-view-page.component')
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
