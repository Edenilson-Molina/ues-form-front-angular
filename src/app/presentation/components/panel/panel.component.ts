import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'c-panel',
  standalone: true,
  imports: [PanelModule, ButtonModule],
  templateUrl: './panel.component.html',
  styles: `
    :host ::ng-deep .p-panel {
      @apply rounded-sm shadow-md p-4;
    }
  `
})
export class PanelComponent {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() collapsed: boolean = true;
}
