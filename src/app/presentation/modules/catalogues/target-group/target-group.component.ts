import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';

import { ButtonComponent } from "../../../components/button/button.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { CardComponent } from "../../../components/card/card.component";
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { DataTableColumnDirective } from '../../../components/data-table/data-table.component';

import { TargetGroupService } from '@services/catalogues/target-group.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../../../components/modal/modal.component";
import { TargetGroupDto } from '@app/interfaces/responses/target-group.dto';
import { TextareaComponent } from "../../../components/inputs/textarea/textarea.component";
import { requestTargetGroupDto } from '@app/interfaces/request/target-group';

@Component({
  selector: 'app-target-group',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    FloatInputTextComponent,
    SelectComponent,
    CardComponent,
    DataTableComponent,
    DataTableColumnDirective,
    TagModule,
    ModalComponent,
    TextareaComponent
],
  templateUrl: './target-group.component.html',
})
export default class TargetGroupComponent {
  // Injecting
  private targetGroupService = inject(TargetGroupService);

  // Signals and State
  showModalDetail = signal(false);
  showModalEdit = signal(false);
  showModalAdd = signal(false);

  detailTarget = signal<TargetGroupDto>({
    id: 0,
    id_usuario: 0,
    nombre: '',
    descripcion: '',
    activo: false,
    created_at: new Date(),
  });
  targetGroupList = signal([]);
  filterName = signal('');
  filterState = signal(null);
  isLoading = signal<boolean>(false);

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    // Form for adding a new target group
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      activo: [true, [Validators.required]]
    });
  }

  // Methods and Lifecycle Hooks
  ngOnInit(): void {
    this.getTargetGroup({
      page: 1,
      filterName: '',
      filterState: null,
    });
  }

  pagination = signal({
    from: 0,
    page: 1,
    per_page: 15,
    to: 0,
    totalItems: 0,
  });

  columns = [
    { field: 'nombre', header: 'Nombre', sortable: true },
    { field: 'activo', header: 'Estado', sortable: true },
  ];

  actionButtons = [
    {
      label: 'Detalle del grupo',
      icon: 'visibility',
      class: 'text-gray-500 dark:text-gray-400 bg-transparent',
      onClick: (data: TargetGroupDto) => {
        this.showModalDetail.set(true);
        this.detailTarget.set({...data});
      },
    },
    {
      label: 'Editar grupo',
      icon: 'edit',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: TargetGroupDto) => {
        this.showModalEdit.set(true);
        this.detailTarget.set({...data});
        console.log(data);
        this.form.patchValue(data);
      },
    },
  ];

  async handlerFilter(){
    await this.getTargetGroup({
      page: 1,
      filterName: this.filterName(),
      filterState: this.filterState(),
    });
  }

  async handleResetFilter() {
    this.filterName.set('');
    this.filterState.set(null);
    await this.getTargetGroup({
      page: 1,
      filterName: '',
      filterState: null,
    });
  }

  async handlePagination(event: any) {
    this.targetGroupList.set([]);
    await this.getTargetGroup({
      page: event.page,
      filterName: this.filterName(),
      filterState: this.filterState(),
    });
  }

  async handleAddTargetGroup() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const response = await this.targetGroupService.createTargetGroup(this.form.value);
    if (response) {
      this.showModalAdd.set(false);
      await this.getTargetGroup({
        page: this.pagination().page,
        filterName: this.filterName(),
        filterState: this.filterState(),
      });
    }
    this.isLoading.set(false);
  }

  async handleEditTargetGroup() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const response = await this.targetGroupService.updateTargetGroup({id:this.detailTarget().id,...this.form.value});
    if (response) {
      this.showModalEdit.set(false);
      await this.getTargetGroup({
        page: this.pagination().page,
        filterName: this.filterName(),
        filterState: this.filterState(),
      });
    }
  }

  async getTargetGroup(requestTargetGroupDto: requestTargetGroupDto) {
    this.isLoading.set(true);
    this.targetGroupList.set([]);
    const response:any = await this.targetGroupService.getTargetGroup(requestTargetGroupDto);
    this.targetGroupList.set(response.data);
    this.pagination.set({
      from: response.meta.from,
      page: response.meta.current_page,
      per_page: response.meta.per_page,
      to: response.meta.to,
      totalItems: response.meta.total,
    });
    this.isLoading.set(false);
  }

  getFormField(key:string): FormControl<string> {
      return this.form.get(key) as FormControl<string>;
  }
}
