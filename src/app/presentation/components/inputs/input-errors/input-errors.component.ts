import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-errors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-errors.component.html',
  styles: ``,
})
export class InputErrorsComponent {
  @Input()
  public formField: FormControl = new FormControl();
  @Input() propertyName!: string;

  @Input()
  public fieldName: string = '';
  errorsStyles: string = 'text-red-700 text-[0.7rem] pl-1 -mt-0.5';

  getJoiErrorMessage(error: string): string {
    return error ? error.replace(/"([^]+)"/, this.fieldName) : '';
  }
}
