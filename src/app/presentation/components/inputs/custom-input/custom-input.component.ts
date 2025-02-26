import { Component, Input, forwardRef } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorsComponent, TooltipModule],
  templateUrl: './custom-input.component.html',
  styles: `
    .file-input {
      padding: 0px; /* Padding adicional si es necesario */
      cursor: pointer; /* Cambia el cursor cuando el input es de tipo file */
    }
    ::ng-host button {
      border-radius: 5px;
      margin: 0px;
      background-color: red;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent {
  public value: string = '';
  public changed: (value: string | Object | null) => void = () => {};
  public touched: () => void = () => {};

  // Input properties
  @Input() parentForm: FormGroup | null = null;
  @Input() arrayField: FormArray | null = null;
  @Input() position: number = 0;
  @Input() isDisabled: boolean = false;
  @Input() fieldName: string = '';
  @Input() placeholder: string = '';
  @Input() prependIcon: string = '';
  @Input() endIcon: string = '';
  @Input() type: string = 'text';
  @Input() rounded: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;

  // Internal state variable
  showPassword = false;

  constructor() {}

  // Computed property for input class
  get inputClass() {
    const classes = [''];
    if (this.prependIcon) classes.push('pl-12');
    if (this.endIcon) classes.push('pr-12');
    if (this.rounded) {
      if (this.rounded === 'full') classes.push('rounded-full');
      else classes.push(`rounded-${this.rounded}`);
    }
    return classes.join(' ');
  }

  // Toggle password visibility
  togglePasswordVisibility(event: MouseEvent) {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
    event.preventDefault();
  }
  public writeValue(value: string): void {
    this.value = value;
  }

  get formField(): FormControl {
    if (this.arrayField) {
      return this.arrayField.controls[this.position].get(this.fieldName ?? '') as FormControl;
    }
    return this.parentForm?.get(this.fieldName ?? '') as FormControl;
  }

  public onChange(event: Event): void {
    if (this.type === 'file') {
      const files = (<HTMLInputElement>event.target).files;
      if (files) {
        this.changed(files[0]);
      }
      return;
    }
    const value: string = (<HTMLInputElement>event.target).value;

    this.changed(value);
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  deleteFile() {
    this.changed(null);
  }
}
