import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { createValidatorFromSchema } from '@app/validators/joi-validator.validator';
import Joi from 'joi';
import { CustomInputComponent } from '@app/presentation/components/inputs/custom-input/custom-input.component';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, ColorPickerModule, FormsModule, DatePickerModule, ReactiveFormsModule, CommonModule, CustomInputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  color: any
  date: any

  click(){
    toast.success('Hello World', {
      description: 'This is a description'
    })
  }

  userForm: FormGroup;
  userFormSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false }}).required(),
    age: Joi.number().min(18).max(99).required()
  });

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: [''],
      email: [''],
      age: [''],
    },
    {
      validator: createValidatorFromSchema(this.userFormSchema)
    }
    );

  }

  submit() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      console.log('Formulario válido:', this.userForm.value);
    } else {
      console.log('Formulario inválido');
      console.log(this.userForm);
    }
  }
}
