import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterLink, ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DrawerModule, Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';

import { Session } from '@interfaces/store';
import { Route } from '@interfaces/common/route.interface';
import { logout, showMenu } from '@app/store/auth.actions';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'drawer',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    RippleModule,
  ],
  templateUrl: './drawer.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  private store = inject(Store);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  menu: Route[] = [
    {
      name: 'Inicio',
      path: '/dashboard',
      icon: 'home',
      permission: [
        'encuesta_ver',
        'encuesta_editor',
        'encuesta_estadisticas',
        'encuesta_publicar'
      ]
    },
    {
      name: 'Usuarios',
      path: '/dashboard/users',
      icon: 'person',
      permission: [
        'usuario_ver',
        'solicitud_desbloqueo_ver',
      ],
      children: [
        {
          name: 'Listado',
          path: '/dashboard/users/list',
          icon: 'manage_accounts',
          permission:[
            'usuario_ver',
            'usuario_crear',
            'usuario_actualizar',
            'solicitud_ver',
            'solicitud_crear',
            'solicitud_actualizar'
          ]
        },
        {
          name: 'Registro',
          path: '/dashboard/users/request-register',
          icon: 'admin_panel_settings',
          permission: [
            'solicitud_desbloqueo_ver',
            'solicitud_desbloqueo_crear',
            'solicitud_desbloqueo_actualizar'
          ]
        }
      ]
    },
    {
      name: 'Encuestas',
      path: '/dashboard/survy',
      icon: 'assignment',
      permission: [
        'encuesta_ver',
        'grupo_meta_ver'
      ],
      children: [
        {
          name: 'Mis encuestas',
          path: '/dashboard/survy/my-surveys',
          icon: 'assignment_ind',
          permission:[
            'encuesta_ver',
            'encuesta_editor',
            'encuesta_estadisticas',
            'encuesta_publicar'
          ]
        },
        {
          name: 'Grupos metas',
          path: '/dashboard/survy/catalogues/target-group',
          icon: 'group',
          permission: [
            'grupo_meta_ver',
            'grupo_meta_crear',
            'grupo_meta_actualizar'
          ]
        }
      ]
    },
    // {
    //   name: 'Pruebas de componentes',
    //   path: '/dashboard/test',
    //   icon: 'experiment'
    // },
  ];

  visible = false;
  username: string = 'Name not found';
  loading = signal<boolean>(false);
  activeRoute: string | null = null;
  // Estado de expansión para cada menú con subrutas (indexado por el path del padre)
  expandedMenus: { [key: string]: boolean } = {};

  session$!: Observable<Session>;
  sessionValue = signal<Session | null>(null);

  constructor() {
    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue.set(session);
      this.visible = session.showMenu;
    });

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
      // Expandir automáticamente los menús padres si una subruta está activa
      this.menu.forEach((route) => {
        if (route.children) {
          this.expandedMenus[route.path] = this.isParentRouteActive(route);
        }
      });
    });

    this.menu.forEach((route) => {
      if (route.children) {
        this.expandedMenus[route.path] = false;
      }
    });
  }

  setVisible(value: boolean): void {
    this.store.dispatch(showMenu(value));
  }

  closeCallback(e: Event): void {
    this.setVisible(false);
  }

  async handleLogout() {
    try {
      this.loading.set(true);
      await this.authService.logout();
      this.store.dispatch(logout());
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar la sesión');
    } finally {
      this.loading.set(false);
    }
  }

  isRouteActive(path: string): boolean {
    return this.activeRoute === path;
  }

  isParentRouteActive(route: Route): boolean {
    if (route.children && this.activeRoute) {
      return route.children.some((subroute) =>
        this.activeRoute?.startsWith(subroute.path)
      );
    }
    return false;
  }

  // Método para alternar el estado de expansión de un menú
  toggleMenu(path: string): void {
    if (this.expandedMenus[path] !== undefined) {
      this.expandedMenus[path] = !this.expandedMenus[path];
    }
  }

  // Método para verificar si un menú está expandido
  isMenuExpanded(path: string): boolean {
    return this.expandedMenus[path] || false;
  }

  // Validar si el usuario tiene permiso para ver un menú
  hasPermission(permisos: string[]): boolean {
    return this.authService.inRoles(permisos);
  }
}
