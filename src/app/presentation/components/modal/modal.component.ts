import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { DialogModule, Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'modal',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './modal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // Input properties
  @Input({ required: true }) visible: boolean = false;
  @Input() closable?: boolean = true;
  @Input() styleClass?: string = '';
  // modal.component.ts
  @Input() style?: { [key: string]: string } = { width: '50vw' };
  @Input() position?:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'center';
  @Input() maximizable?: boolean = false;
  @Input() maximizeIcon?: string = 'pi pi-window-maximize';
  @Input() minimizeIcon?: string = 'pi pi-window-minimize';

  @Output() onClose = new EventEmitter();

  executeCallback() {
    this.onClose.emit();
  }
}
