import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { Session } from '@app/interfaces/store';
import { ModalComponent } from "../../../../components/modal/modal.component";
import { ButtonComponent } from "../../../../components/button/button.component";
import { TextareaComponent } from "../../../../components/inputs/textarea/textarea.component";

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
    ModalComponent,
    ButtonComponent,
    TextareaComponent
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
  formUnlock!: FormGroup;
  redirect: string = '';

  showModalRequestUnlock = signal<boolean>(false);
  showModalSubmittedRequest: boolean = false;

  constructor( private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.formUnlock = this.fb.group({
      justificacion_solicitud: ['', Validators.required],
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
        const { accessToken, isUnlocked } = response;
        this.store.dispatch(login(accessToken, isUnlocked));

        // Check if the user is unlocked
        if(this.sessionValue.isUnlocked){
          this.router.navigate([this.redirect]);
        }else{
          this.showModalRequestUnlock.set(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  getFormField(key:string): FormControl<string> {
    return this.form.get(key) as FormControl<string>;
  }

  getFormUnlockField(key:string): FormControl<string> {
    return this.formUnlock.get(key) as FormControl<string>;
  }

  navigateToRegister() {
    this.router.navigate(['/request-register']);
  }

  async handleRequestUnlock() {
    this.formUnlock.markAllAsTouched();
    if (this.formUnlock.valid) {
      try {
        await this.authService.requestUnlockUser(this.formUnlock.value);
        this.showModalRequestUnlock.set(false);
        this.showModalSubmittedRequest = true;
      } catch (error) {
        //console.error(error);
      }
    }
  }

  handleEndRequestUnlock() {
    this.formUnlock.reset();
    this.form.reset();
    this.showModalRequestUnlock.set(false);
    this.showModalSubmittedRequest = false;
    this.router.navigate(['/login']);
  }
}
