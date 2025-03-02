import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';

import { DividerModule } from 'primeng/divider';

import { ButtonComponent } from '@app/presentation/components/button/button.component';
import { ModalComponent } from '@app/presentation/components/modal/modal.component';

type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
interface ButtonCustom {
  label: string;
  severity: Severity;
  icon: string;
}

@Component({
  selector: 'app-test',
  imports: [CommonModule, DividerModule, ButtonComponent, ModalComponent],
  templateUrl: './test.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center justify-center w-full'
  }
})
export default class TestComponent {
  ////////////////////////////////////////////////////////////////
  //                    ModalComponent                          //
  ////////////////////////////////////////////////////////////////
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    console.log('closeModal');
    this.showModal = false;
  }

  ////////////////////////////////////////////////////////////////
  //                    ButtonComponent                         //
  ////////////////////////////////////////////////////////////////

  test() {
    console.log('Test action');
  }
  buttons: ButtonCustom[]  = [
    {
      label: 'Primary',
      severity: 'primary',
      icon: 'account_circle'

    },
    {
      label: 'Secondary',
      severity: 'secondary',
      icon: 'palette'
    },
    {
      label: 'Success',
      severity: 'success',
      icon: 'check_circle'
    },
    {
      label: 'Info',
      severity: 'info',
      icon: 'info'
    },
    {
      label: 'Warning',
      severity: 'warning',
      icon: 'warning'
    },
    {
      label: 'Danger',
      severity: 'danger',
      icon: 'dangerous'
    }
  ]
}
