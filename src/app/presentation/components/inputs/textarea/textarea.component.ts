import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, Input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';

import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

@Component({
  selector: 'c-textarea',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    FloatLabelModule,
    FluidModule,
    InputErrorsComponent,
  ],
  templateUrl: './textarea.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'containerClass',
    '[style]': 'containerStyle',
  },
})
export class TextareaComponent implements ControlValueAccessor {
  value: string | null = '';
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  // Input properties
  @Input() id: string = '';
  @Input() rows: number = 3;
  @Input() autoResize: boolean = false;
  @Input() spellcheck: boolean = false;
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
