import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  Input,
  Optional,
  Self,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  AbstractControl,
  Form,
  FormControl,
  NgControl,
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FluidModule } from 'primeng/fluid';
import { InputErrorsComponent } from '../input-errors/input-errors.component';
import { Valid } from 'luxon/src/_util';

@Component({
  selector: 'c-float-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    FluidModule,
    InputErrorsComponent,
  ],
  templateUrl: './float-input-text.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatInputTextComponent),
      multi: true,
    },
  ],
})
export class FloatInputTextComponent implements ControlValueAccessor {
  value: string | null = '';
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  // Input properties
  @Input() id: string = '';
  @Input() type: 'text' | 'email' | 'url' | 'tel' | 'search' = 'text';
  @Input() icon?: string;
  @Input() iconColor?: string;
  @Input() iconClass?: string;
  @Input() iconPosition?: 'left' | 'right';
  @Input() containerClass: string = '';
  @Input() containerStyle?: Record<string, string>;
  @Input() label: string = '';
  @Input() typeLabel: 'label' | 'floatLabel' = 'floatLabel';
  @Input() placeholder: string = '';
  @Input() floatLabelVariant: 'in' | 'on' | 'over' = 'on';
  @Input() labelClass: string = '';
  @Input() inputClass?: string;
  @Input() inputStyle?: Record<string, string>;
  @Input() errorMessageClass: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() variant: 'filled' | 'outlined' = 'filled';
  @Input() size?: 'small' | 'large';
  @Input() formControl!: FormControl

  required = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  get hasErrors() {
    return this.formControl?.invalid && (this.formControl?.dirty || this.formControl?.touched);
  };

  public writeValue(value: string | null): void {
    this.value = value || '';
  }

  public registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
  }

  public onInputBlur(): void {
    this.onTouched();
  }
}
