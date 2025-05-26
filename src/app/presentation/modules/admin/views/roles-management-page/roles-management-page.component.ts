import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TagModule } from 'primeng/tag';

import { ButtonComponent } from "../../../../components/button/button.component";
import { CardComponent } from "../../../../components/card/card.component";
import { FloatInputTextComponent } from "../../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../../components/inputs/select/select.component";
import { DataTableColumnDirective, DataTableComponent } from "../../../../components/data-table/data-table.component";
import { ModalComponent } from "../../../../components/modal/modal.component";
import { TextareaComponent } from "../../../../components/inputs/textarea/textarea.component";

import { RoleService } from '@app/services/catalogues/roles.service';
import { MultiSelectComponent } from "../../../../components/inputs/multiselect/multiselect.component";

@Component({
  selector: 'app-roles-management-page',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    CardComponent,
    FloatInputTextComponent,
    SelectComponent,
    DataTableComponent,
    DataTableColumnDirective,
    ModalComponent,
    TextareaComponent,
    TagModule,
    MultiSelectComponent
],
  templateUrl: './roles-management-page.component.html',
})
export default class RolesManagementPageComponent {

  // Inyeccion de servicios
  private rolesService = inject(RoleService);

  // Lista de roles
  roles = signal([]);
  permissions = signal<any>([]);

  // Banderas para modales
  showCreateRoleModal = signal(false);
  showEditRoleModal = signal(false);

  // Variables
  idRole = signal<number | null>(null);
  isLoading = signal(false);
  filterRoles = signal({
    name: '',
    estado: null,
  });
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
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'description', header: 'Descripción', sortable: true },
    { field: 'activo', header: 'Estado', sortable: true, headerClass: '!justify-center' },
  ];
  actionButtons = [
    {
      label: 'Editar rol',
      icon: 'badge',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: async (data: any) => {
        this.idRole.set(data.id);
        this.form.reset();
        this.form.patchValue({
          name: data.name,
          description: data.description,
          activo: data.activo ? 1 : 0,
          permissions: data.permissions.map((permission: any) => {
            return permission.name;
          }) || [],
        });
        this.showEditRoleModal.set(true);
      },
    },
  ]


  // Formularios
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(3) ]],
      description: ['', [ Validators.required, Validators.minLength(10) ]],
      activo: [1, [ Validators.required ]],
      permissions: [[], [ Validators.required, Validators.minLength(1) ]],
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
  }

  async getRoles(){
    this.roles.set([]);
    try{
      this.isLoading.set(true);
      const response: any = await this.rolesService.getAllRoles({
        paginate: this.paginationParams().paginate,
        page: this.paginationParams().page,
        per_page: this.paginationParams().per_page,
        name: this.filterRoles().name,
        estado: this.filterRoles().estado,
      });
      this.roles.set(response.data);
      this.pagination.set({
        from: response.pagination.from,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        to: response.pagination.to,
        totalItems: response.pagination.totalItems,
      });
      this.isLoading.set(false);
    }catch (error) {}
  }

  async getPermissions() {
    try {
      this.permissions.set([
        { name: 'USUARIO_VER', value: 'usuario_ver' },
        { name: 'USUARIO_CREAR', value: 'usuario_crear' },
        { name: 'USUARIO_ACTUALIZAR', value: 'usuario_actualizar' },
        { name: 'ROL_VER', value: 'rol_ver' },
        { name: 'ROL_CREAR', value: 'rol_crear' },
        { name: 'ROL_ACTUALIZAR', value: 'rol_actualizar' },
        { name: 'SOLICITUD_REGISTRO_VER', value: 'solicitud_ver' },
        { name: 'SOLICITUD_REGISTRO_CREAR', value: 'solicitud_crear' },
        { name: 'SOLICITUD_REGISTRO_ACTUALIZAR', value: 'solicitud_actualizar' },
        { name: 'SOLICITUD_DESBLOQUEO_VER', value: 'solicitud_desbloqueo_ver' },
        { name: 'SOLICITUD_DESBLOQUEO_CREAR', value: 'solicitud_desbloqueo_crear' },
        { name: 'SOLICITUD_DESBLOQUEO_ACTUALIZAR', value: 'solicitud_desbloqueo_actualizar' },
        { name: 'RUTA_VER', value: 'ruta_ver' },
        { name: 'RUTA_CREAR', value: 'ruta_crear' },
        { name: 'RUTA_ACTUALIZAR', value: 'ruta_actualizar' },
        { name: 'ENCUESTA_VER', value: 'encuesta_ver' },
        { name: 'ENCUESTA_EDITOR', value: 'encuesta_editor' },
        { name: 'ENCUESTA_ESTADISTICAS', value: 'encuesta_estadisticas' },
        { name: 'ENCUESTA_PUBLICAR', value: 'encuesta_publicar' },
        { name: 'GRUPO_META_VER', value: 'grupo_meta_ver' },
        { name: 'GRUPO_META_CREAR', value: 'grupo_meta_crear' },
        { name: 'GRUPO_META_ACTUALIZAR', value: 'grupo_meta_actualizar' },
      ]);
    } catch (error) {}
  }

  async updateRole() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    try {
      const response: any = await this.rolesService.updateRole(this.idRole()!,{
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        activo: this.form.get('activo')?.value,
        permissions: this.form.get('permissions')?.value,
      });
      await this.getRoles();
      this.showEditRoleModal.set(false);
    } catch (error) {}
  }

  async createRole() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    try {
      const response: any = await this.rolesService.createRole({
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        activo: this.form.get('activo')?.value,
        permissions: this.form.get('permissions')?.value,
      });
      await this.getRoles();
      this.showCreateRoleModal.set(false);
    } catch (error) {}
  }

  resetFilters() {
    this.filterRoles.set({
      name: '',
      estado: null,
    });
    this.paginationParams.set({
      page: 1,
      per_page: 10,
      paginate: true,
    });
    this.getRoles();
  }

  handlePagination(event: any) {
    this.roles.set([]);
    this.paginationParams.set({
      page: event.page,
      per_page: event.per_page,
      paginate: true,
    });
    this.getRoles();
  }

  getFormField(key: string): FormControl<string> {
    return this.form.get(key) as FormControl<string>;
  }

  openModalCreateRole() {
    this.showCreateRoleModal.set(true);
    this.form.reset();
    this.form.patchValue({
      name: '',
      description: '',
      activo: 1,
      permissions: [],
    });
  }
}
