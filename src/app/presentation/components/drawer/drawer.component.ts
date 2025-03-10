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

  @ViewChild('drawerRef') drawerRef!: Drawer;

  menu: Route[] = [
    {
      name: 'Inicio',
      path: '/dashboard',
      icon: 'home',
    },
    {
      name: 'Usuarios',
      path: '/dashboard/users',
      icon: 'person',
    },
    {
      name: 'Tareas',
      path: '/dashboard/educacion',
      icon: 'editor_choice',
    },
    {
      name: 'Pruebas de componentes',
      path: '/dashboard/test',
      icon: 'experiment',
    },
  ];

  visible = false;
  username: string = 'Name not found';
  loading = signal<boolean>(false);

  session$!: Observable<Session>;
  sessionValue = signal<Session | null>(null);

  constructor() {
    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue.set(session);
      this.visible = session.showMenu;
    });
  }

  setVisible(value: boolean): void {
    this.store.dispatch(showMenu(value));
  }

  closeCallback(e: Event): void {
    this.setVisible(false);
  }


  handleLogout(): void {
    try {
      this.loading.set(true);
      this.store.dispatch(logout());
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar la sesión');
    } finally {
      this.loading.set(false);
    }
  }
}
