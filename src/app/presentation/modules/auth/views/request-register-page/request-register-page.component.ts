import { Component, inject, signal } from '@angular/core';
import { CardComponent } from "../../../../components/card/card.component";
import { FloatInputTextComponent } from "../../../../components/inputs/float-input-text/float-input-text.component";
import { TextareaComponent } from "../../../../components/inputs/textarea/textarea.component";
import { ButtonComponent } from "../../../../components/button/button.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RequestRegisterState } from '@app/interfaces/store';
import { Observable } from 'rxjs';
import { requestRegister, requestRegisterReset } from '@store/request-register.action';
import { ModalComponent } from "../../../../components/modal/modal.component";
import { AuthService } from '@app/services/auth.service';
import { FloatInputPasswordComponent } from "../../../../components/inputs/float-input-password/float-input-password.component";
import { InputOtp } from 'primeng/inputotp';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-request-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    FloatInputTextComponent,
    TextareaComponent,
    ButtonComponent,
    ModalComponent,
    FloatInputPasswordComponent,
    FormsModule,
    InputOtp
  ],
  templateUrl: './request-register-page.component.html',
  host: {
    class: 'bg-cover bg-no-repeat bg-login flex min-h-screen',
  },
})
export default class RequestRegisterPageComponent {
  private router = inject(Router);
  private store = inject(Store);
  private authService = inject(AuthService);

  requestRegister$!: Observable<RequestRegisterState>;
  requestRegisterValue!: RequestRegisterState;
  form!: FormGroup;
  code: any;

  showModalValidEmail: boolean = false;
  showModalConfirmCode: boolean = false;
  showModalConfirmRequest: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    // form request register
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      nombre: ['',[Validators.required]],
      apellido: ['', [Validators.required]],
      identificacion: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      justificacion_solicitud: ['', [Validators.required]],
    });

    // subscribe to the store
    this.requestRegister$ = this.store.select('requestRegister');
    this.requestRegister$.subscribe((requestRegister) => {
      this.requestRegisterValue = requestRegister;
    });

    this.form.patchValue(this.requestRegisterValue);
  }

  getFormField(key:string): FormControl<string> {
    return this.form.get(key) as FormControl<string>;
  }

  onClose(){
    this.router.navigate(['/auth/login']);
  }

  // Validar datos del formulario:
  // Guardar los datos en el store y mostrar el modal
  onSubmit(){
    this.form.markAllAsTouched();

    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.form.get('confirmPassword')?.setErrors({ notMatching: true });
    }

    if (this.form.valid) {
      this.store.dispatch(requestRegister({...this.form.value}));
      this.showModalValidEmail = true;
    }
  }

  // Enviar el correo de verificación
  async onSendEmail() {
    try {
      const { email } = this.form.value;
      await this.authService.sendVerificationEmail({ email });
      this.code = null;
      this.showModalValidEmail = false;
      this.showModalConfirmCode = true;
    }
    catch (error) {
      if (error instanceof AxiosError) {
        this.closeModal();
      }
    }
  }

  // Validar el código de verificación y
  // si es correcto, enviar la solicitud de registro
  async onConfirmCode() {
    try {
      const { email } = this.form.value;
      const response = await this.authService.verifyEmail({ email, verification_code: this.code });

      if (response.success) {
        await this.authService.requestRegister(this.form.value);
      }

      this.showModalConfirmCode = false;
      this.showModalConfirmRequest = true;
    }
    catch (error) {
      // if (error instanceof AxiosError) {
      //   this.closeModal();
      // }
    }
  }

  // Finalizar el registro
  closeModal() {
    this.showModalValidEmail = false;
    this.showModalConfirmCode = false;

    if(this.showModalConfirmRequest){
      this.showModalConfirmRequest = false;

      // Reset the form
      this.store.dispatch(requestRegisterReset());

      this.router.navigate(['/auth/login']);
    }
  }
}
