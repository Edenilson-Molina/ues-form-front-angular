import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from './guards/redirectIfAuthenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'UES-Forms',
    canActivate: [RedirectIfAuthenticatedGuard],
    loadComponent: () => import('./presentation/modules/auth/views/login-page/login-page.component')
  },
  {
    path: 'request-register',
    title: 'Request Register',
    canActivate: [RedirectIfAuthenticatedGuard],
    loadComponent: () => import('./presentation/modules/auth/views/request-register-page/request-register-page.component')
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./presentation/layouts/dashboard/dashboard.component'),
    children: [
      {
        path: '',
        title: 'Inicio',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/home/home.component')
      },
      {
        path: 'survy/my-surveys',
        title: 'Encuestas',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/survy/home-survy/home-survy.component')
      },
      {
        path: 'survy/form-editor/:formId',
        title: 'Form Editor',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/survy/form-editor/form-editor.component')
      },
      {
        path: 'survy/catalogues/target-group',
        title: 'Grupos Metas',
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
        title: 'Usuarios',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/admin/views/users-management-page/users-management-page.component')
      },
      {
        path: 'users/request-register',
        title: 'Registros',
        canActivate: [AuthGuard],
        data: { Permissions: ['encuesta_ver'] },
        loadComponent: () => import('./presentation/modules/admin/views/request-register-admin-page/request-register-admin-page.component')
      }
    ]
  },
  {
    path: 'survey/:id',

  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
