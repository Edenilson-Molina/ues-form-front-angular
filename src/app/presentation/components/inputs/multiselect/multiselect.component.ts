import { CommonModule } from '@angular/common';
import { Component, ContentChild, forwardRef, input, Input, TemplateRef } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FluidModule } from 'primeng/fluid';

import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

@Component({
  selector: 'c-multiselect',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    FluidModule,
    InputErrorsComponent,
  ],
  templateUrl: './multiselect.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'containerClass',
    '[style]': 'containerStyle',
  },
})
export class MultiSelectComponent implements ControlValueAccessor {
  value: string[] | null = [];
  onChange: (value: string[] | null) => void = () => {};
  onTouched: () => void = () => {};

  @Input() id: string = '';
  @Input() containerClass: string = '';
  @Input() containerStyle?: Record<string, string>;
  @Input() icon?: string;
  @Input() iconColor?: string;
  @Input() iconClass?: string;
  @Input() loading: boolean = false;
  @Input() options: any[] = [];
  @Input() emptyMessage: string = 'No se encuentran resultados';
  @Input() emptyFilterMessage: string = 'No se encuentran resultados';
  @Input() filter: boolean = false;
  @Input() filterMatchMode: 'startsWith' | 'contains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' = 'contains';
  @Input() optionLabel?: string;
  @Input() optionValue?: string;
  @Input() label: string = '';
  @Input() typeLabel: 'label' | 'floatLabel' = 'floatLabel';
  @Input() floatLabelVariant: 'in' | 'on' | 'over' = 'on';
  @Input() labelClass: string = '';
  @Input() placeholder: string = '';
  @Input() panelClass?: string;
  @Input() panelStyle?: Record<string, string>;
  @Input() inputClass?: string;
  @Input() inputStyle?: Record<string, string>;
  @Input() errorMessageClass: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() variant: 'filled' | 'outlined' = 'filled';
  @Input() size?: 'small' | 'large';
  @Input() formControl!: FormControl;
  @Input() display: 'comma' | 'chip' = 'comma';

  required = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  @ContentChild('item') itemTemplate!: TemplateRef<any>;
  @ContentChild('selectedItems') selectedItemsTemplate!: TemplateRef<any>;
  @ContentChild('header') headerTemplate!: TemplateRef<any>;
  @ContentChild('footer') footerTemplate!: TemplateRef<any>;

  get hasErrors() {
    return this.formControl?.invalid && (this.formControl?.dirty || this.formControl?.touched);
  }

  public writeValue(value: string[] | null): void {
    this.value = value || [];
  }

  public registerOnChange(fn: (value: string[] | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onInputChange(event: MultiSelectChangeEvent): void {
    this.value = event.value;
    this.onChange(this.value);
  }

  public onInputBlur(): void {
    this.onTouched();
  }
}
