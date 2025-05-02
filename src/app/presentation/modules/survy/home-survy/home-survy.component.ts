import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from "../../../components/button/button.component";
import { CardComponent } from "../../../components/card/card.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { DataTableColumnDirective } from '../../../components/data-table/data-table.component';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-home-survy',
  standalone: true,
  imports: [ButtonComponent, CardComponent, FloatInputTextComponent, SelectComponent, DataTableComponent, DataTableColumnDirective, TagModule ],
  templateUrl: './home-survy.component.html',
})
export default class HomeSurvyComponent {
  encuestas = signal([
    {
      titulo: 'Quiere trabajar con tres tecnologias diferentes a la vez?',
      grupo_meta: 'explotacion',
      fecha_publicacion: '2023-10-01',
      estado: 'Activa',
    },
    {
      titulo: 'Le gusta hacer el figma del proyecto?',
      grupo_meta: 'senior',
      fecha_publicacion: '2023-10-02',
      estado: 'Activa',
    },
    {
      titulo: 'Le gusta caminar desde bolivar hasta el excuartel?',
      grupo_meta: 'chambeador',
      fecha_publicacion: '2023-10-03',
      estado: 'Inactiva',
    },
  ]);

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
    { field: 'titulo', header: 'Titulo', sortable: true },
    { field: 'grupo_meta', header: 'Grupo Meta', sortable: true },
    { field: 'fecha_publicacion', header: 'Fecha Publicacion', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true },
  ];

  actionButtons = [
    {
      label: 'Editar Encuesta',
      icon: 'visibility',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: any) => console.log('View item:', data),
    },
    {
      label: 'Responder Encuesta',
      icon: 'arrow_outward',
      class: 'text-primary-500 dark:text-primary-400 bg-transparent',
      onClick: (data: any) => console.log('Delete item:', data),
    },
    {
      label: 'Estadísticas',
      icon: 'bar_chart',
      class: 'text-green-500 dark:text-green-400 bg-transparent',
      onClick: (data: any) => console.log('Delete item:', data),
    },


  ]

  handlePagination(event: any) {
    this.encuestas.set([]);
    this.paginationParams.set({
      page: event.page,
      per_page: event.per_page,
      paginate: true,
    });
  }
}
