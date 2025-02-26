import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserDropdownComponent } from '../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../dropdowns/notification-dropdown/notification-dropdown.component';
import { CardMenu } from '../../interfaces/route.interface';
import { GlobalFunctionsService } from '../../utils/services/global-functions.service';
import { Store } from '@ngrx/store';
import { CandidateSearcherComponent } from '../dropdowns/candidate-searcher/candidate-searcher.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    UserDropdownComponent,
    NotificationDropdownComponent,
    CandidateSearcherComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() visible = true;
  private global = inject(GlobalFunctionsService);
  private store = inject(Store);
  router = inject(Router);
  roles!: string[];
  permissions!: string[];
  routes!: CardMenu[];
  canSearch = false;

  collapseShow = 'hidden';

  constructor() {
    this.store.select('session').subscribe((session) => {
      if (session.user) {
        this.roles = session.user.roles;
        this.permissions = session.user.permissions;
        this.routes = this.global.getMenu(true);

        this.canSearch = this.roles.includes('user') || this.roles.includes('recruiter');
      }
    });
  }

  toggleCollapseShow(classes: string) {
    this.collapseShow = classes;
  }
}
