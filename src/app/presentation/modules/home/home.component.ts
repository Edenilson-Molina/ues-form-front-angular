import { ChangeDetectorRef, Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ButtonComponent } from "../../components/button/button.component";
import { InfoCardComponent } from "../../components/info-card/info-card.component";
import { CardComponent } from "../../components/card/card.component";
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    ButtonComponent,
    InfoCardComponent,
    CardComponent,
    DataTableComponent,
    ChartModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent {

  constructor(private cd: ChangeDetectorRef) {}

  encuestas = signal([
    {
      encuesta: 'Quiere trabajar con tres tecnologias diferentes a la vez?',
      participantes: 100
    },
    {
      encuesta: 'Le gusta hacer el figma del proyecto?',
      participantes: 50
    },
    {
      encuesta: 'Le gusta caminar desde bolivar hasta el excuartel?',
      participantes: 20
    }
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
    { field: 'encuesta', header: 'Nombre', sortable: true },
    { field: 'participantes', header: 'Participantes', sortable: true },
  ];

  actionButtons = [
    {
      icon: 'visibility',
      label: 'Ver encuesta',
      class: 'text-blue-500 dark:text-blue-400 bg-transparent',
      onClick: (data: any) => console.log('View item:', data),
    }
  ];

  handlePagination(event: any) {
    this.encuestas.set([]);
    this.paginationParams.set({
      page: event.page,
      per_page: event.per_page,
      paginate: true,
    });
  }

  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
                }
            ]
        };

        this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
        this.cd.markForCheck()
    }
  }
}
