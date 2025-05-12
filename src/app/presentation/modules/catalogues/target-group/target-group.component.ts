import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';

import { ButtonComponent } from "../../../components/button/button.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { CardComponent } from "../../../components/card/card.component";
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { DataTableColumnDirective } from '../../../components/data-table/data-table.component';

import { TargetGroupService } from '@services/catalogues/target-group.service';

@Component({
  selector: 'app-target-group',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    FloatInputTextComponent,
    SelectComponent,
    CardComponent,
    DataTableComponent,
    DataTableColumnDirective,
    TagModule
  ],
  templateUrl: './target-group.component.html',
})
export default class TargetGroupComponent {
  // Injecting
  private targetGroupService = inject(TargetGroupService);

  // Signals and State
  targetGroupList = signal([]);
  filterTargetGroup = signal({
    nombre: '',
    estado: null,
  });
  isLoading = signal<boolean>(false);
  pagination = signal({
    from: 0,
    page: 1,
    per_page: 15,
    to: 0,
    totalItems: 0,
  });
  columns = [
    { field: 'nombre', header: 'Nombre', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true },
  ];
  actionButtons = [
    {
      label: 'Detalle del grupo',
      icon: 'visibility',
      class: 'text-gray-500 dark:text-gray-400 bg-transparent',
      onClick: (data: any) => console.log('View item:', data),
    },
    {
      label: 'Editar grupo',
      icon: 'edit',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: any) => console.log('Delete item:', data),
    },
  ];

  // Methods and Lifecycle Hooks
  ngOnInit(): void {
    this.getTargetGroup();
  }

  async getTargetGroup() {
    this.isLoading.set(true);
    const response:any = await this.targetGroupService.getTargetGroup();
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

  async getTargetGroupPaginated(page: number) {
    this.isLoading.set(true);
    const response:any = await this.targetGroupService.getTargetGroupPaginated(page);
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

  handlePagination(event: any) {
    this.targetGroupList.set([]);
    this.getTargetGroupPaginated(event.page);
  }
}
