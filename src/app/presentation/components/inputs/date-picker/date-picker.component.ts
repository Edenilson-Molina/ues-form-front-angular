import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, Input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';

import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

@Component({
  selector: 'c-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    FloatLabelModule,
    FluidModule,
    InputErrorsComponent,
  ],
  templateUrl: './date-picker.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent {
  value: string | null = '';
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  // Input properties
  @Input() id: string = '';
  @Input() type: 'text' | 'email' | 'url' | 'tel' | 'search' = 'text';
  @Input() icon?: string;
  @Input() iconColor?: string;
  @Input() iconClass?: string;
  @Input() showIcon: boolean = true;
  @Input() containerClass: string = '';
  @Input() containerStyle?: Record<string, string>;
  @Input() label: string = '';
  @Input() typeLabel: 'label' | 'floatLabel' = 'floatLabel';
  @Input() placeholder: string = '';
  @Input() floatLabelVariant: 'in' | 'on' | 'over' = 'on';
  @Input() labelClass: string = '';
  @Input() inputClass?: string;
  @Input() inputStyle?: Record<string, string>;
  @Input() panelClass?: string;
  @Input() panelStyle?: Record<string, string>;
  @Input() errorMessageClass: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() variant: 'filled' | 'outlined' = 'filled';
  @Input() dateFormat?: string;
  @Input() hourFormat: '12' | '24' = '24';
  @Input() timeOnly: boolean = false;
  @Input() showTime: boolean = false;
  @Input() inline: boolean = false;
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() maxDateCount?: number;
  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() size?: 'small' | 'large';
  @Input() formControl!: FormControl;

  required = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  get hasErrors() {
    return (
      this.formControl?.invalid &&
      (this.formControl?.dirty || this.formControl?.touched)
    );
  }

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

  public onDateChange(event: any): void {
    console.log('onDateChange', event);
  }
}
