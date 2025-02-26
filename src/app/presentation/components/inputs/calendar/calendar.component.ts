import { Component, Input, forwardRef } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarModule, ReactiveFormsModule, CommonModule, FormsModule, InputErrorsComponent],
  templateUrl: './calendar.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
})
export class CalendarComponent {
  public value: string | Date | null = '';
  public changed: (value: string | Date | null) => void = () => {};
  public touched: () => void = () => {};

  @Input() parentForm: FormGroup | null = null;
  @Input() fieldName: string = '';
  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() isDisabled: boolean = false;
  @Input() rounded: string = 'lg';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() showIcon: boolean = true;
  @Input() showTime: boolean = false;
  @Input() InputId: string = 'label';
  @Input() loading: boolean = false;

  public writeValue(value: string): void {
    this.value = value;
  }

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  public onChange(event: any): void {
    const value: Date | string | null = event;
    this.value = value;
    this.changed(value);
    this.touched();
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
}
