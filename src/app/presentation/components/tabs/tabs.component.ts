import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, WritableSignal } from '@angular/core';

import { primaryColors } from '@utils/useColorPalette';

@Component({
  selector: 'c-tabs',
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styles: ``
})
export class TabsComponent {
  @Input() items: any[] = []; // Lista de tabs
  @Input() activeItem: any = 0; // Índice del tab activo
  @Input() mainContainerClass: string = ''; // Clase personalizada para el contenedor principal
  @Input() backgroundColorTab: string = '#6366f1'; // Color del indicador
  @Input() label: string = 'label'; // Propiedad a mostrar en el tab
  @Input() containerTabsClass: string = ''; // Clase personalizada para los tabs
  @Input() containerItemsClass: string = ''; // Clase personalizada para los items
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'sm'; // Estilo redondeado
  @Input() tabsDesign: 'line' | 'panel' = 'line'; // Diseño de los tabs

  @Output() changeTab = new EventEmitter<number>(); // Emitir evento cuando se cambia de tab

  @ContentChild('customLabel') customLabelTemplate!: TemplateRef<any>;
  @ContentChild('tabContent') tabContentTemplate!: TemplateRef<any>;

  // Método para determinar el color del texto del tab
  getTextDesign(index: number): string {
    if (this.tabsDesign === 'line') {
      return this.activeItem === index ? this.backgroundColorTab : '#6d7280';
    }
    return '';
  }

  // Método para cambiar el tab activo
  selectTab(index: number) {
    this.changeTab.emit(index);
  }

  getTabClasses(): string[] {
    return [
      this.activeItem === 0 && this.tabsDesign === 'panel' ? 'translate-x-1.5' : '',
      this.activeItem === this.items.length - 1 && this.tabsDesign === 'panel' ? '-translate-x-1.5' : '',
      this.tabsDesign === 'line' ? 'rounded-none' : `rounded-${this.rounded}`,
      this.tabsDesign === 'line' ? 'h-[10%] bottom-0' : 'h-[80%]',
      this.tabsDesign === 'line' ? 'z-10' : 'z-5',
    ];
  }
}
