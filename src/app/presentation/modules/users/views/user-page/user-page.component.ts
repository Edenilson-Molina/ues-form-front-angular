import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

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
import { FloatInputTextComponent } from "@components/inputs/float-input-text/float-input-text.component";
import { ButtonComponent } from "../../../../components/button/button.component";
import { CreateUserComponent } from "../../components/create-user/create-user.component";

@Component({
  selector: 'app-user-page',
  imports: [FormsModule, DataTableComponent, FloatInputTextComponent, ButtonComponent, CreateUserComponent],
  templateUrl: './user-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserPageComponent {
  protected userService = inject(UserService);
  private store = inject(Store);

  isLoading = signal<boolean>(false);
  users = signal<UserResponse[]>([]);
  showModalCreateUser = signal<boolean>(false);

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
      this.getAllUser(this.paginationParams(), this.filters());
    });
  }

  getAllUser(pagination: PaginationParams, filters: UserParams | null): void {
    this.userService
    .getAllUsers({ ...pagination, ...filters })
    .subscribe((response) => {
      if ('data' in response) {
        this.users.set(response.data);
        this.pagination.set(response.pagination);
      } else {
        this.users.set(response);
      }
    });
  }

  setFilters(): void {
    if(!this.name && !this.email) {
      this.filters.set(null);
      return;
    }
    this.filters.set({
      name: this.name,
      email: this.email,
    });
  }

  clearFilters(): void {
    this.name = '';
    this.email = '';
    this.setFilters();
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
  ];

  actionButtons: ActionButtonConfiguration[] = [
    {
      icon: 'visibility',
      label: 'Ver usuario',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: any) => console.log('View item:', data),
    },
    {
      icon: 'edit',
      label: 'Editar usuario',
      class: 'text-orange-500 dark:text-orange-400 bg-transparent',
      onClick: (data: any) => console.log('Edit item:', data),
    },
    {
      icon: 'delete',
      label: 'Eliminar usuario',
      class: 'text-red-500 dark:text-red-400 bg-transparent',
      onClick: (data: any) => console.log('Delete item:', data),
    },
  ];

  openCreateUserModal() {
    this.showModalCreateUser.set(true);
  }

  closeCreateUserModal(success: boolean) {
    if(success) {
      this.users.set([]);
      this.getAllUser(this.paginationParams(), this.filters());
    }
    this.showModalCreateUser.set(false);
  }
}
