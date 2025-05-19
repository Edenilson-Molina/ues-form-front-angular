import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-users-management-page',
  standalone: true,
  imports: [],
  templateUrl: './users-management-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersManagementPageComponent { }
