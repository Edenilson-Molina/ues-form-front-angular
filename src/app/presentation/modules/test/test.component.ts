import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import { getLuxonDateAdapter } from '@app/services/common/luxon-date.service';
import { UserService } from '@services/user.service';

import { ButtonComponent } from '@components/button/button.component';
import { ModalComponent } from '@components/modal/modal.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { SelectComponent } from '@components/inputs/select/select.component';
import {
  DataTableColumnDirective,
  DataTableComponent,
} from '@components/data-table/data-table.component';

import { Session } from '@interfaces/store';
import { UserResponse } from '@interfaces/responses/user.dto';
import {
  Pagination,
  PaginationParams,
} from '@interfaces/common/pagination.interface';
import { ActionButtonConfiguration, ColumnDefinition, PageEvent } from '@interfaces/common/data-table.interface';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '@app/presentation/components/inputs/date-picker/date-picker.component';

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
    FormsModule,
    DividerModule,
    TagModule,
    ButtonComponent,
    ModalComponent,
    TabsComponent,
    DatePickerComponent,
    SelectComponent,
    DataTableComponent,
    DataTableColumnDirective,
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
  sessionValue!: Session;
  isLoading = signal(false);
  luxonAdapter = getLuxonDateAdapter();

  ngOnInit() {
    // NgOnInit
  }

  constructor() {
    this.store.select('session').subscribe((session: Session) => {
      this.isLoading.set(session.isLoading);
    });

    effect(() => {
      this.userService
        .getAllUsers(this.paginationParams())
        .subscribe((response) => {
          if ('data' in response) {
            this.users.set(response.data);
            this.pagination.set(response.pagination);
          } else {
            this.users.set(response);
          }

          this.users().forEach((user, index) => {
            user.status = index % 2 === 0 ? 'active' : 'inactive';
          });
        });
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
  //                      SelectComponent                         //
  //////////////////////////////////////////////////////////////////

  selection1 = undefined;
  selection2 = undefined;
  selection3 = undefined;

  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
  ];

  //////////////////////////////////////////////////////////////////
  //                      SelectComponent                         //
  //////////////////////////////////////////////////////////////////

  date1 = undefined;
  date2 = undefined;
  date3 = undefined;
  date4 = undefined;

  maxDate = this.luxonAdapter.addDays(new Date(), 10);
  minDate = this.luxonAdapter.subtractDays(new Date(), 10);

  //////////////////////////////////////////////////////////////////
  //                      TableComponent                          //
  //////////////////////////////////////////////////////////////////
  protected userService = inject(UserService);
  // Los users serán reflejados gracias al EFFECT que se encuentra en el constructor de este componente
  users = signal<UserResponse[]>([]);
  paginationParams = signal<PaginationParams>({
    page: 1,
    limit: 10,
    paginate: true,
  });
  pagination = signal<Pagination>({
    from: 0,
    page: 1,
    limit: 10,
    to: 0,
    totalItems: 0,
  });

  handlePagination(event: PageEvent) {
    this.users.set([]);
    this.paginationParams.set({
      page: event.page,
      limit: event.limit,
      paginate: true,
    });
  }

  columns: ColumnDefinition[] = [
    {
      field: 'id',
      header: 'ID',
      sortable: true,
      class: 'text-center font-bold', // This will be ignored if you pass a custom template
    },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'email', header: 'Correo electrónico', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
  ];

  actionButtons = [
    {
      icon: 'visibility',
      severity: 'info',
      label: 'Ver usuario',
      class: '', // This will be ignored if you pass a custom template
      onClick: (data: any) => console.log('View item:', data),
    },
    {
      icon: 'edit',
      label: 'Editar usuario',
      severity: 'primary',
      class: 'text-blue-500 hover:text-blue-600 bg-transparent', // This will be ignored if you pass a custom template
      onClick: (data: any) => this.editItem(data),
    },
    {
      icon: 'delete',
      severity: 'danger',
      label: 'Eliminar usuario',
      class: 'text-red-500 hover:text-red-600 bg-transparent', // This will be ignored if you pass a custom template
      onClick: (data: any) => this.deleteItem(data),
    },
  ];

  editItem(item: any) {
    console.log('Edit item:', item);
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
  }
}
