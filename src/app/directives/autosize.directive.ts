import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutosize]',
  standalone: true
})
export class AutosizeDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<HTMLTextAreaElement>) {}

  // Ajustar la altura al inicializar el componente
  ngAfterViewInit() {
    this.adjustHeight();
  }

  // Ajustar la altura cada vez que el usuario escribe
  @HostListener('input')
  onInput() {
    this.adjustHeight();
  }

  // Método para ajustar la altura del textarea
  private adjustHeight() {
    const textarea = this.elementRef.nativeElement;
    // Resetear la altura para calcular el scrollHeight correctamente
    textarea.style.height = 'auto';
    // Ajustar la altura según el contenido (scrollHeight)
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}