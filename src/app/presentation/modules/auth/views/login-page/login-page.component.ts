import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, CardModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './login-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-cover bg-no-repeat bg-login flex min-h-screen'
  }
})
export default class LoginPageComponent {

}
