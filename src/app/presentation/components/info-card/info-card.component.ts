import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'c-info-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './info-card.component.html',
  styles: `
    :host ::ng-deep .p-card {
      background: none !important;
      box-shadow: none !important;
    }
  `,
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';

  getBgColor = computed<string>(() => {
    switch (this.severity) {
      case 'primary':
        return 'bg-[#2F4858] dark:bg-[#1B2A34]';
      case 'secondary':
        return 'bg-[#33658A] dark:bg-[#254054]';
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-[#86BBD8] dark:bg-[#5A9BB5]';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return '';
    }
  });

  getTextColor = computed<string>(() => {
    switch (this.severity) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-white';
      case 'success':
        return 'text-white';
      case 'info':
        return 'text-black';
      case 'warning':
        return 'text-black';
      case 'danger':
        return 'text-white';
      default:
        return '';
    }
  });
}
