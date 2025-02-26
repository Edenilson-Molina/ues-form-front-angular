import { Component, Input, forwardRef } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [DropdownModule, ReactiveFormsModule, CommonModule, FormsModule, InputErrorsComponent],
  templateUrl: './select.component.html',
  styles: `
    ::ng-deep .p-dropdown-panel .p-dropdown-header .p-dropdown-filter {
      border-color: white;
      color: #1a202c;
      placeholder-color: #cbd5e0;
      padding-left: 12px;
      padding-right: 36px;
      padding-top: 12px;
      padding-bottom: 12px;
      font-size: 0.875rem;
      border-radius: 0.25rem;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.06);
      width: 100%;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent {
  public value: string | number = '';
  public changed: (value: string | number) => void = () => {};
  public touched: () => void = () => {};

  @Input() parentForm: FormGroup | null = null;
  @Input() arrayField: FormArray | null = null;
  @Input() position: number = 0;
  @Input() fieldName: string = '';
  @Input() selectOptions: Array<any> = [];
  @Input() isDisabled: boolean = false;
  @Input() rounded: string = 'lg';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() filter: boolean = false;
  @Input() filterBy: string = 'label';
  @Input() loading: boolean = false;

  public writeValue(value: string): void {
    this.value = value;
  }

  get formField(): FormControl {
    if (this.arrayField) {
      return this.arrayField.controls[this.position].get(this.fieldName ?? '') as FormControl;
    }
    return this.parentForm?.get(this.fieldName ?? '') as FormControl;
  }

  public onChange(event: any): void {
    const value: string | number = event.value;
    this.changed(value);
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
}
