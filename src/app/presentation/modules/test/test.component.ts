import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';

import { DividerModule } from 'primeng/divider';

import { ButtonComponent } from '@app/presentation/components/button/button.component';
import { ModalComponent } from '@app/presentation/components/modal/modal.component';
import { TabsComponent } from '@app/presentation/components/tabs/tabs.component';

type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
interface ButtonCustom {
  label: string;
  severity: Severity;
  icon: string;
}

@Component({
  selector: 'app-test',
  imports: [CommonModule, DividerModule, ButtonComponent, ModalComponent, TabsComponent],
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
  ////////////////////////////////////////////////////////////////
  //                     TabComponent                           //
  ////////////////////////////////////////////////////////////////
  test2(data:any) {
    console.log(data);
  }

  tabsItems = [
    { label: 'Label 1', content: 'Contenido del Tab 1' },
    { label: 'Label 2', content: 'Contenido del Tab 2' },
  ];
  activeTabItem = 0;

  tabsItems2 = [
    { label: 'Label 1', content: 'Contenido del Tab 1' },
    { label: 'Label 2', content: 'Contenido del Tab 2' },
    { label: 'Label 3', content: 'Contenido del Tab 3' },
  ];
  activeTabItem2 = 0;

  tabsItems3 = [
    { label: 'Label 1', content: 'Contenido del Tab 1' },
    { label: 'Label 2', content: 'Contenido del Tab 2' },
    { label: 'Label 3', content: 'Contenido del Tab 3' },
    { label: 'Label 4', content: 'Contenido del Tab 4' },
    { label: 'Label 5', content: 'Contenido del Tab 5' },
    { label: 'Label 6', content: 'Contenido del Tab 6' },
    { label: 'Label 7', content: 'Contenido del Tab 7' },
    { label: 'Label 8', content: 'Contenido del Tab 8' },
    { label: 'Label 9', content: 'Contenido del Tab 9' },
    { label: 'Label 10', content: 'Contenido del Tab 10' },
  ];
  activeTabItem3 = 0;

  activeTabItem4 = signal(0);

  changeTab4(index: number) {
    this.activeTabItem4.set(index);
  }

  tabsItems4 = [
    { label: 'Label 1', content: 'Contenido del Tab 1' },
    { label: 'Label 2', content: 'Contenido del Tab 2' },
    { label: 'Label 3', content: 'Contenido del Tab 3' },
    { label: 'Label 4', content: 'Contenido del Tab 4' },
    { label: 'Label 5', content: 'Contenido del Tab 5' },
  ];
}
