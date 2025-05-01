import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'c-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './card.component.html',
  styles: `
    :host ::ng-deep .p-card {
      background: none !important;
      box-shadow: none !important;
    }
  `,
})
export class CardComponent {
  @Input() titleCard: string = '';
  @Input() subtitleCard: string = '';
  @Input() chip: string = '';
  @Input() icon: string = '';

}
