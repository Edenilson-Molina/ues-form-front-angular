import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChild,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationTableInput } from '../../interfaces/pagination.interface';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [TableModule, TagModule, PaginatorModule, CommonModule],
  templateUrl: './data-table.component.html',
  styles: [
    `
      :host ::ng-deep .p-inputtext {
        padding: 0.3rem 0.75rem;
        color: #5271ff;
        font-weight: bold;
      }
    `,
  ],
})
export class DataTableComponent {
  @Input() columns: any[] = [];
  @Input() invertedColors: boolean = false;
  @Input() rows: any[] = [];
  @Input() haveActions: boolean = false;
  @Input() headerAlign: string = 'left';
  @Input() tableStyle: string = 'min-width: 50rem';
  @Input() showPagination: boolean = false;
  @Input() pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };
  @Input() showGlobalFilter: boolean = false;
  @Input() canSort: boolean = false;
  @Input() sortByOptions: any[] = [];
  @ContentChild('actions', { static: true }) actionsTemplate!: TemplateRef<any>;
  @Output() setPagination = new EventEmitter();
  @Output() setGlobalFilter = new EventEmitter();
  @Output() setSorting = new EventEmitter();

  selectedOption: any = 10;
  currentPage: number = 1;
  search = '';
  sortBy = '';
  errorSearch = false;
  rowsToShow: any[] = [];

  ngOnInit() {
    this.paginate();
  }

  alphaNumericSpace = (value: string) => {
    const regex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ0-9\s:]*$/;
    return regex.test(value);
  };

  public onChange(event: Event): void {
    if (this.alphaNumericSpace(this.search)) {
      this.errorSearch = false;
      this.setGlobalFilter.emit(this.search);
    } else {
      this.errorSearch = true;
    }
  }

  public onSort(event: any): void {
    this.setSorting.emit(this.sortBy);
  }

  colorPercentage(percentage: number) {
    if (percentage >= 90) {
      return 'bg-green-500';
    }
    if (percentage >= 80) {
      return 'bg-teal-500';
    }
    if (percentage >= 70) {
      return 'bg-blue-500';
    }
    if (percentage >= 55) {
      return 'bg-violet-500';
    }
    if (percentage < 30) {
      return 'bg-red-500';
    }
    if (percentage < 45) {
      return 'bg-orange';
    }
    if (percentage < 55) {
      return 'bg-yellow-300';
    }
    return 'bg-slate-500';
  }

  colorTag(estado: any) {
    if (['Activo', 'Aprobada', 'Contratado'].includes(estado)) {
      return 'success';
    }
    if (['Inactivo', 'Rechazada', 'Descartado'].includes(estado)) {
      return 'danger';
    }
    if (['Inhabilitado', 'Pendiente', 'Aplicada'].includes(estado)) {
      return 'warning';
    }
    return 'info';
  }

  selectPerPage(event: any) {
    this.selectedOption = event.value;
    this.currentPage = 1;
    this.setPagination.emit({ page: 1, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  nextPage() {
    if (this.currentPage * this.pagination.perPage() < this.pagination.total) {
      this.currentPage++;
    }
    this.setPagination.emit({ page: this.currentPage, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.setPagination.emit({ page: this.currentPage, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  goToPage(page: any) {
    this.currentPage = page;
    this.setPagination.emit({ page: this.currentPage, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  get pageRange() {
    const total_pages = Math.ceil(this.pagination.total / this.pagination.perPage());
    const range = 5;
    let start = this.currentPage - Math.floor(range / 2);
    start = Math.max(start, 1);
    let end = start + range - 1;
    end = Math.min(end, total_pages);
    start = Math.max(end - range + 1, 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  paginate() {
    this.rowsToShow = this.rows;
  }
}
