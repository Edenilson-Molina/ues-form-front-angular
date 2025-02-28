import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerComponent } from "../../components/drawer/drawer.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DrawerComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  constructor() {}
}
