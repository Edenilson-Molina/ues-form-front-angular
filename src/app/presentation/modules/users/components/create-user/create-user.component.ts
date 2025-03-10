import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ModalComponent } from '@components/modal/modal.component';
import { FloatInputTextComponent } from '@components/inputs/float-input-text/float-input-text.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { createValidatorFromSchema } from '@validators/joi-validator.validator';
import { userFormSchema } from '../../schemas';
import { ButtonComponent } from "@components/button/button.component";
import { UserService } from '@services/user.service';
import { toast } from 'ngx-sonner';
import { FloatInputPasswordComponent } from "@components/inputs/float-input-password/float-input-password.component";

@Component({
  selector: 'create-user',
  imports: [ReactiveFormsModule, ModalComponent, FloatInputTextComponent, ButtonComponent, FloatInputPasswordComponent],
  templateUrl: './create-user.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
  private userService = inject(UserService)

  @Input() visible: boolean = false;
  @Input() isLoading = signal<boolean>(false);
  @Output() closeModal = new EventEmitter<boolean>(false);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        email: [''],
        name: [''],
        password: [''],
      },
      {
        validators: createValidatorFromSchema(userFormSchema),
      }
    );
  }

  getControlForm(formControlName: string) {
    return this.form.get(formControlName) as FormControl;
  }

  onCloseModal(success: boolean = false) {
    this.closeModal.emit(success);
    this.form.reset();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.userService.createUser(this.form.value).subscribe(() => {
        this.onCloseModal(true);
        toast.success('Usuario creado correctamente', {
          duration: 5000,
        });
      });
    }
  }
}
