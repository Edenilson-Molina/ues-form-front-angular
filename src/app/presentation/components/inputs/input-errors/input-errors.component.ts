import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'input-errors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-errors.component.html',
  styles: ``,
})
export class InputErrorsComponent {
  @Input({ required: true }) formField!: FormControl | AbstractControl;
  @Input({ required: true }) propertyName!: string;
  @Input({ required: true }) label: string = '';
  @Input() color = 'text-red-600'

  errorStyles = computed(() => `${this.color} text-[0.7rem] pl-1 -mt-0.5`);

  getJoiErrorMessage(error: string): string {
    return error ? error.replace(/"([^]+)"/, this.label) : '';
  }
}
