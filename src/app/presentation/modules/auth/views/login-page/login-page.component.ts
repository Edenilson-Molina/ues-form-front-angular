import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// PrimeNG modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

// Global components
import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

import { AuthService } from '@services/auth.service';

import { login } from '@store/auth.actions';
import { LOCAL_STORAGE } from '@utils/constants.utils';
import { Session } from '@app/interfaces/store';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PasswordModule,
    InputErrorsComponent,
  ],
  templateUrl: './login-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-cover bg-no-repeat bg-login flex min-h-screen',
  },
})
export default class LoginPageComponent {
  private router = inject(Router);
  private store = inject(Store);
  private authService = inject(AuthService);
  session$!: Observable<Session>;
  sessionValue!: Session;
  form!: FormGroup;
  redirect: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue = session;
    });

    this.route.queryParams.subscribe((params: Params) => {
      this.redirect = params['redirect'] || '/dashboard';
    });
  }

  async handleFormSubmit(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      await this.submit();
    }
  };

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      try{
        const response = await this.authService.login(this.form.value);
        const { accessToken, refreshToken } = response;
        this.store.dispatch(login(accessToken, refreshToken));
        this.router.navigate([this.redirect]);
      } catch (error) {
        console.error(error);
      }
    }
  }

  getFormField(key:string): FormControl<string> {
    return this.form.get(key) as FormControl<string>;
  }
}
