import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { UserService } from '@app/services/user.service';
import { usePagination } from '@utils/pagination';

import { DataTableComponent } from '@components/data-table/data-table.component';

import {
  ActionButtonConfiguration,
  ColumnDefinition,
  PageEvent,
} from '@interfaces/common/data-table.interface';
import {
  Pagination,
  PaginationParams,
} from '@interfaces/common/pagination.interface';
import { UserResponse } from '@interfaces/responses/user.dto';
import { UserParams } from '@interfaces/request/user.dto';

@Component({
  selector: 'app-user-page',
  imports: [DataTableComponent],
  templateUrl: './user-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserPageComponent {
  protected userService = inject(UserService);
  private store = inject(Store);

  isLoading = signal<boolean>(false);

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
  filters = signal<UserParams | null>(null);
  email = '';
  name = '';

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.isLoading.set(session.isLoading);
    });

    effect(() => {
      this.userService
        .getAllUsers({ ...this.paginationParams(), ...this.filters() })
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

  setFilters(): void {
    this.filters.set({
      name: this.name,
      email: this.email,
    });
  }

  handlePagination(event: PageEvent) {
    this.users.set([]);
    this.paginationParams.set({
      page: event.page,
      limit: event.limit,
      paginate: true,
    });
  }

  columns: ColumnDefinition[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'email', header: 'Correo electrónico', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
  ];

  actionButtons: ActionButtonConfiguration[] = [
    {
      icon: 'visibility',
      label: 'Ver usuario',
      class: 'text-blue-500 hover:text-blue-600 bg-transparent',
      onClick: (data: any) => console.log('View item:', data),
    },
    {
      icon: 'edit',
      label: 'Editar usuario',
      class: 'text-orange-500 hover:text-orange-600 bg-transparent',
      onClick: (data: any) => console.log('Edit item:', data),
    },
    {
      icon: 'delete',
      label: 'Eliminar usuario',
      class: 'text-red-500 hover:text-red-600 bg-transparent',
      onClick: (data: any) => console.log('Delete item:', data),
    },
  ];
}
