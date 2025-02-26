import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styles: [],
})
export class SpinnerComponent {
  @Input() styles = { width: '4rem', height: '4rem' };
}
