import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';

import { Session } from '@app/interfaces/store';
import { toggleDarkMode } from '@app/store/auth.actions';

@Component({
  selector: 'navbar',
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
    MenubarModule,
    TooltipModule,
  ],
  templateUrl: './navbar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit{
  private store = inject(Store);
  protected router = inject(Router);
  session$!: Observable<Session>;
  sessionValue!: Session;

  name: string = 'Invitado';
  role: string = 'Invitado';

  constructor() {
    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue = session;
      this.name = session.user?.name || 'Invitado';
      this.role = session.user?.roles[0] || 'Invitado';
    });
  }

  ngOnInit() {
    if(this.sessionValue.darkMode) {
      const root = document.documentElement;
      root.classList.toggle('dark-mode', this.sessionValue.darkMode);
      root.classList.toggle('dark', this.sessionValue.darkMode);
    }
  }

  toggleDarkMode() {
    this.store.dispatch(toggleDarkMode());
  }
}
