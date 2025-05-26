import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';

import { ButtonComponent } from "../../../../components/button/button.component";
import { CardComponent } from "../../../../components/card/card.component";
import { FloatInputTextComponent } from "../../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../../components/inputs/select/select.component";
import { DataTableColumnDirective, DataTableComponent } from "../../../../components/data-table/data-table.component";
import { ModalComponent } from "../../../../components/modal/modal.component";

import { UserService } from '@app/services/user.service';
import { StateService } from '@app/services/catalogues/states.service';
import { DataUser, User } from '@app/interfaces/responses/user.dto';
import { RouterLink } from '@angular/router';
import { MultiSelectComponent } from "../../../../components/inputs/multiselect/multiselect.component";
import { RoleService } from '@app/services/catalogues/roles.service';

@Component({
  selector: 'app-users-management-page',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    FloatInputTextComponent,
    SelectComponent,
    DataTableComponent,
    DataTableColumnDirective,
    ModalComponent,
    TagModule,
    MultiSelectComponent
],
  templateUrl: './users-management-page.component.html'
})
export default class UsersManagementPageComponent {
  // Inyeccion de servicios
  private userService = inject(UserService);
  private stateService = inject(StateService);
  private roleService = inject(RoleService);

  filterUsers = signal({
    nombre: '',
    id_estado: null,
  });

  users = signal<User[]>([]);
  user = signal<DataUser>({} as DataUser);
  states = signal([]);
  roles = signal([]);
  showModalUser = signal(false);

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id_estado: [null, Validators.required],
      roles: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getStates();
    this.getRoles();
  }

  async updateUser() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    const response: any = await this.userService.updateUser(
      this.user().id,
      this.form.value.id_estado,
      this.form.value.roles,
    );
    this.showModalUser.set(false);
    this.form.reset();
    await this.getUsers();
  }

  async getUsers() {
    this.users.set([]);
    try{
      this.isLoading.set(true);
      const response: any = await this.userService.getAllUsers({
        paginate: true,
        page: this.paginationParams().page,
        per_page: this.paginationParams().per_page,
        nombre_usuario: this.filterUsers().nombre,
        id_estado: this.filterUsers().id_estado,
      });
      this.users.set(response.data);
      this.pagination.set({
        from: response.pagination.from,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        to: response.pagination.to,
        totalItems: response.pagination.totalItems,
      });
      this.isLoading.set(false);
    }catch (error) {
    }
  }

  async getStates() {
    try{
      const response: any = await this.stateService.getStates('users');
      this.states.set(response.data);
    }catch (error) {
    }
  }

  async getRoles() {
    try{
      const response: any = await this.roleService.getAllRoles({
        estado: 1,
      });
      this.roles.set(response.data.map((role: any) => ({
        name: role.name,
      })));

    }catch (error) {
    }
  }

  async filterUsersData() {
    this.getUsers();
  }

  async resetFilters() {
    this.filterUsers.set({
      nombre: '',
      id_estado: null,
    });
    this.paginationParams.set({
      page: 1,
      per_page: 10,
      paginate: true,
    });
    await this.getUsers();
  }

  isLoading = signal<boolean>(false);

  paginationParams = signal({
    page: 1,
    per_page: 10,
    paginate: true,
  });

  pagination = signal({
    from: 0,
    page: 1,
    per_page: 10,
    to: 0,
    totalItems: 0,
  });

  columns = [
    { field: 'usuario.persona', header: 'Nombre', sortable: true },
    { field: 'usuario.username', header: 'Usuario', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true, headerClass: '!justify-center' },
  ];

  actionButtons = [
    {
      label: 'Editar cuenta',
      icon: 'manage_accounts',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: async (data: User) => {
        const response = await this.userService.getUserById(data.id);
        this.user.set(response.data);
        this.form.reset();
        this.form.patchValue({
          id_estado: response.data.id_estado,
          roles: response.data.roles.map((role) => role.name),
        });
        this.showModalUser.set(true);
      },
    },
  ]

  handlePagination(event: any) {
    this.users.set([]);
    this.paginationParams.set({
      page: event.page,
      per_page: event.per_page,
      paginate: true,
    });
    this.getUsers();
  }

  getFormField(key: string): FormControl<string> {
    return this.form.get(key) as FormControl<string>;
  }
}
