import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { DividerModule } from 'primeng/divider';

import { UserService } from '@services/user.service';

import { ButtonComponent } from '@components/button/button.component';
import { ModalComponent } from '@components/modal/modal.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { ColumnDefinition, DataTableActionsDirective, DataTableColumnDirective, DataTableComponent } from '@components/data-table/data-table.component';
import { UserResponse } from '@app/interfaces/responses/user.dto';
import { Observable } from 'rxjs';
import { PaginationParams } from '@interfaces/common/pagination.interface';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';

type Severity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
interface ButtonCustom {
  label: string;
  severity: Severity;
  icon: string;
}

@Component({
  selector: 'app-test',
  imports: [
    CommonModule,
    DividerModule,
    ButtonComponent,
    ModalComponent,
    TabsComponent,
    DataTableComponent,
    DataTableColumnDirective,
    DataTableActionsDirective
  ],
  templateUrl: './test.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center justify-center w-full',
  },
})
export default class TestComponent implements OnInit {
  private store = inject(Store);
  sessionValue!: Session
  isLoading = signal(false);

  constructor() {
    this.store.select('session').subscribe((session: Session) => {
      this.isLoading.set(session.isLoading);
    });
  }
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
  buttons: ButtonCustom[] = [
    {
      label: 'Primary',
      severity: 'primary',
      icon: 'account_circle',
    },
    {
      label: 'Secondary',
      severity: 'secondary',
      icon: 'palette',
    },
    {
      label: 'Success',
      severity: 'success',
      icon: 'check_circle',
    },
    {
      label: 'Info',
      severity: 'info',
      icon: 'info',
    },
    {
      label: 'Warning',
      severity: 'warning',
      icon: 'warning',
    },
    {
      label: 'Danger',
      severity: 'danger',
      icon: 'dangerous',
    },
  ];
  ////////////////////////////////////////////////////////////////
  //                     TabComponent                           //
  ////////////////////////////////////////////////////////////////
  test2(data: any) {
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

  //////////////////////////////////////////////////////////////////
  //                      TableComponent                          //
  //////////////////////////////////////////////////////////////////
  protected userService = inject(UserService);
  users = signal<UserResponse[]>([]);
  paginationObserver = Observable<PaginationParams>
  paginationParams = signal<PaginationParams>({ page: 1, limit: 10, paginate: true });

  async ngOnInit(): Promise<void> {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.userService.getAllUsers(this.paginationParams()).subscribe((response) => {
      if ('data' in response) {
        this.users.set(response.data.flat());
      } else {
        this.users.set(response);
      }

      this.users().forEach((user, index) => {
        user.status = (index % 2) === 0 ? 'active' : 'inactive';
      });
    });
  }

  columns: ColumnDefinition[] = [
    { field: 'id', header: 'ID', sortable: false, class:'text-center font-bold' },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'email', header: 'Correo electrónico', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
  ];

  actionButtons = [
    {
      icon: 'edit',
      label: 'Editar usuario',
      class: 'text-blue-500 hover:text-blue-600 bg-transparent',
      onClick: (data: any) => this.editItem(data)
    },
    {
      icon: 'delete',
      label: 'Eliminar usuario',
      class: 'text-red-500 hover:text-red-600 bg-transparent',
      onClick: (data: any) => this.deleteItem(data)
    }
  ];

  pagination = {
    from: 1,
    page: 1,
    perPage: 10,
    to: 3,
    total: 3
  };

  getStatusClass(status: string) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 px-2 py-1 rounded';
      case 'inactive': return 'bg-red-100 text-red-800 px-2 py-1 rounded';
      case 'pending': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded';
      default: return '';
    }
  }

  editItem(item: any) {
    console.log('Edit item:', item);
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
  }
}
