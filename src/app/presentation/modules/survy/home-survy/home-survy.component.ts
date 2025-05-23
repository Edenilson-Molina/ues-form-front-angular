import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from "../../../components/button/button.component";
import { CardComponent } from "../../../components/card/card.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { DataTableComponent } from "../../../components/data-table/data-table.component";
import { DataTableColumnDirective } from '../../../components/data-table/data-table.component';

import { SurvyService } from '@app/services/survy.service';
import { SurveyDto } from '@app/interfaces/responses/survy.dto';

@Component({
  selector: 'app-home-survy',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    FloatInputTextComponent,
    SelectComponent,
    DataTableComponent,
    DataTableColumnDirective,
    TagModule
  ],
  templateUrl: './home-survy.component.html',
})
export default class HomeSurvyComponent {
  // Injecting
  private mysurvyService = inject(SurvyService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getSurveys();
  }

  filterSurveys = signal<any>({
    titulo: '',
    grupo_meta: '',
    id_estado: null,
  });
  encuestas = signal<SurveyDto[]>([]);

  async filterSurveysData() {
    this.encuestas.set([]);
    await this.getSurveys();
  }

  async resetFilters() {
    this.filterSurveys.set({
      titulo: '',
      grupo_meta: '',
      id_estado: null,
    });
    this.paginationParams.set({
      page: 1,
      per_page: 10,
      paginate: true,
    });
    await this.getSurveys();
  }

  async getSurveys() {
    this.isLoading.set(true);
    const { page, per_page } = this.paginationParams();
    const { titulo, grupo_meta, id_estado } = this.filterSurveys();
    const response = await this.mysurvyService.getSurveys(
      {
        page,
        per_page,
        titulo,
        grupo_meta,
        id_estado,
      }
    );
    this.encuestas.set(response.data);
    this.pagination.set({
      from: response.pagination.from,
      page: response.pagination.page,
      per_page: response.pagination.per_page,
      to: response.pagination.to,
      totalItems: response.pagination.totalItems,
    });
    this.isLoading.set(false);
  }

  async createSurveys() {
    const response:any = await this.mysurvyService.createSurvey();
    if (response.success) {
      this.router.navigate(['/dashboard/survy/form-editor/' + response.data.id]);
    }
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
    { field: 'titulo', header: 'Titulo', sortable: true },
    { field: 'grupo_meta', header: 'Grupo Meta', sortable: true, headerClass: '!justify-center' },
    { field: 'fecha_publicacion', header: 'Fecha Publicacion', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true, headerClass: '!justify-center' },
  ];

  actionButtons = [
    {
      label: 'Editar Encuesta',
      icon: 'visibility',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: any) => this.router.navigate(['/dashboard/survy/form-editor/' + data.id]),
    },
    {
      label: 'Responder Encuesta',
      icon: 'arrow_outward',
      class: 'text-primary-500 dark:text-primary-400 bg-transparent',
      onClick: (data: any) => this.router.navigate(['/survey/' + data.codigo]),
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
    this.getSurveys();
  }
}
