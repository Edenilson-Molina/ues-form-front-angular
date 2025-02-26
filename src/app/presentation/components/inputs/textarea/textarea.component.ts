import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputErrorsComponent, TooltipModule],
  templateUrl: './textarea.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent {
  public value: string = '';
  public changed: (value: string | Object | null) => void = () => {};
  public touched: () => void = () => {};

  // Input properties
  @Input() parentForm: FormGroup | null = null;
  @Input() isDisabled: boolean = false;
  @Input() fieldName: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 2;
  @Input() rounded: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;

  constructor() {}

  // Computed property for input class
  get inputClass() {
    const classes = [''];
    if (this.rounded) {
      if (this.rounded === 'full') classes.push('rounded-full');
      else classes.push(`rounded-${this.rounded}`);
    }
    return classes.join(' ');
  }

  public writeValue(value: string): void {
    this.value = value;
  }

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  public onChange(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;

    this.changed(value);
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
}
