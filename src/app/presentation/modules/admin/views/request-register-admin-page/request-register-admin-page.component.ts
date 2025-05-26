import { Component, inject, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';

import { ButtonComponent } from "../../../../components/button/button.component";
import { CardComponent } from "../../../../components/card/card.component";
import { FloatInputTextComponent } from "../../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../../components/inputs/select/select.component";
import { DataTableComponent } from "../../../../components/data-table/data-table.component";
import { DataTableColumnDirective } from '../../../../components/data-table/data-table.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StateService } from '@app/services/catalogues/states.service';
import { UserService } from '@app/services/user.service';
import { RequestUser } from '@app/interfaces/responses/user.dto';
import { ModalComponent } from "../../../../components/modal/modal.component";
import { CommonModule } from '@angular/common';
import { TextareaComponent } from "../../../../components/inputs/textarea/textarea.component";


@Component({
  selector: 'app-request-register-admin-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TagModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    FloatInputTextComponent,
    SelectComponent,
    DataTableComponent,
    DataTableColumnDirective,
    ModalComponent,
    TextareaComponent
],
  templateUrl: './request-register-admin-page.component.html',
})
export default class RequestRegisterAdminPageComponent {
  //Inyeccion de servicios
  private stateService = inject(StateService);
  private userService = inject(UserService);

  filterRegister = signal({
    nombre: '',
    id_estado: null,
  });

  users = signal<RequestUser[]>([]);
  user = signal<RequestUser>({} as RequestUser);
  states = signal([]);
  showModalUser = signal(false);

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      justificacion_rechazo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      id_estado: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getStates();
    this.getUsers();
  }

  async updateUser() {
    this.form.markAllAsTouched();

    const { id_estado, justificacion_rechazo } = this.form.value;
    const userId = this.user().id;

    // Si el estado es 6, no se requiere justificación
    if (id_estado === 6) {
      await this.userService.updateRegisterUser(userId, id_estado);
    } else {
      // Validar el formulario antes de continuar
      if (!this.form.valid) return;
      await this.userService.updateRegisterUser(userId, id_estado, justificacion_rechazo);
    }

    this.showModalUser.set(false);
    this.form.reset();
    await this.getUsers();
  }

  async getUsers() {
    this.users.set([]);
    this.isLoading.set(true);
    const response = await this.userService.getUsersFiltered({
      page: this.paginationParams().page,
      per_page: this.paginationParams().per_page,
      paginate: this.paginationParams().paginate,
      nombre_usuario: this.filterRegister().nombre,
      id_estado: this.filterRegister().id_estado,
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
  }

  async getStates() {
    try {
      const response:any = await this.stateService.getStates('requests');
      if (response.success) this.states.set(response.data);
    } catch (error) {

    }
  }

  async filterRegisterData() {
    await this.getUsers();
  }

  async resetFilters() {
    this.filterRegister.set({
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
    { field: 'usuario.created_at', header: 'Fecha de solicitud', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true, headerClass: '!justify-center' },
  ];

  actionButtons = [
    {
      label: 'Editar cuenta',
      icon: 'manage_accounts',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: RequestUser) => {
        this.user.set(data);
        this.form.reset();
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

  getFormField(key:string): FormControl<string> {
    return this.form.get(key) as FormControl<string>;
  }
}
