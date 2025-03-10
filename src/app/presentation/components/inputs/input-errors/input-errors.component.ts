import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';

@Component({
  selector: 'input-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-errors.component.html',
  styles: ``,
})
export class InputErrorsComponent {
  @Input({ required: true }) errors!: { [key: string]: any } | null | undefined;
  @Input({ required: true }) label: string = '';
  @Input() errorMessageClass: string = 'text-red-500';

  errorStyles = computed(() => `block text-red-500 dark:text-red-400 pl-1 mt-1 leading-[15px] ${this.errorMessageClass}`);

  getJoiErrorMessage(error: string): string {
    return error ? error.replace(/"([^]+)"/, this.label) : '';
  }

  getErrorMessage(): string {
    console.log(this.errors);
    if(this.errors){
      if (this.errors['required']) {
        return `El campo ${this.label} es requerido.`;
      }

      if (this.errors['noEmptyString']) {
        return 'Ingresa un valor válido';
      }

      if (this.errors['email']) {
        return 'Formato inválido del email';
      }

      if (this.errors['noWhitespaceRequired']) {
        return 'No se permiten espacios';
      }

      if (this.errors['minlength']) {
        return `Campo ${this.label} debe tener al menos ${this.errors?.['minlength'].requiredLength} caracteres.`;
      }

      if (this.errors['maxlength']) {
        return `Campo ${this.label} debe tener máximo ${this.errors?.['maxlength'].requiredLength} caracteres.`;
      }

      if (this.errors['pattern']) {
        return `Campo ${this.label} debe respetar el formato ${this.errors?.['pattern'].requiredPattern}.`;
      }

      if (this.errors['min']) {
        return `Campo ${this.label} debe disponer de un valor mínimo de ${this.errors?.['min'].min}.`;
      }

      if (this.errors['max']) {
        return `Campo ${this.label} debe disponer de un valor máximo de ${this.errors?.['max'].max}.`;
      }

      if (this.errors['joiError']) {
        return this.getJoiErrorMessage(this.errors?.['joiError']);
      }
    }
    return '';
  }
}
