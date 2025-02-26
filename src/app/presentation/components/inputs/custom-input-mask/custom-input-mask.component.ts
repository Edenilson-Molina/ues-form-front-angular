import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { InputErrorsComponent } from '../input-errors/input-errors.component';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-custom-input-mask',
  standalone: true,
  imports: [NgClass, InputErrorsComponent, NgIf, InputMaskModule, ReactiveFormsModule],
  templateUrl: './custom-input-mask.component.html',
  styles: ``,
})
export class CustomInputMaskComponent {
  public value: string = '';
  public changed: (value: string) => void = () => {};
  public touched: () => void = () => {};

  // Input properties
  @Input() parentForm!: FormGroup;
  @Input() isDisabled: boolean = false;
  @Input() fieldName: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() rounded: string = 'lg';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() mask: string = '';

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  public onChange(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;
    this.parentForm?.setValue({ [this.fieldName]: value });

    this.changed(value);
  }
}
