import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterContentInit,
  ChangeDetectionStrategy,
  Directive,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';

import {
  PageEvent,
  ColumnDefinition,
  ActionButtonConfiguration,
  PaginationCustomDesignProperties,
} from '@interfaces/common/data-table.interface';
import { Pagination } from '@interfaces/common/pagination.interface';

// Create custom directives for our templates
@Directive({
  selector: '[dataTableColumn]',
  standalone: true,
})
export class DataTableColumnDirective {
  @Input('dataTableColumn') columnName!: string;
  constructor(public template: TemplateRef<any>) {}
}

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ProgressSpinnerModule,
    TooltipModule,
    CardModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center justify-center w-full',
  },
})
export class DataTableComponent implements AfterContentInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Input() isLoading: boolean = false;
  @Input() roundedTypeTable: string = 'lg';
  @Input() stripedRows: boolean = true;
  @Input() styleClass: string = '';
  @Input() tableStyle: Record<string, string> = {};
  @Input() tableClass: string = '';
  @Input() scrollable: boolean = true;
  @Input() scrollHeight: string = 'flex';
  @Input() showPagination: boolean = true;
  @Input() showPerPageOptionsDropdown: boolean = true;
  @Input() showPrevNextLinks: boolean = false;
  @Input() showFirstLastLinks: boolean = false;
  @Input() headerAlign: string = 'start';
  @Input() actionsAlign: string = 'center';
  @Input() rowsPerPageOptions: number[] = [2, 5, 10, 15];
  @Input() actionButtonsConfiguration: ActionButtonConfiguration[] = [];
  @Input() pagination: Pagination = {
    from: 0,
    page: 1,
    limit: 2,
    to: 0,
    totalItems: 0,
  };
  @Input() paginationCustomDesign: boolean = false;
  @Input() paginationCustomDesignProperties: PaginationCustomDesignProperties =
    {
      pageSelectedBackgroundColor: '#56b686',
      pageSelectedColor: '#FFFFFF',
      pageBackgroundColor: 'transparent',
      pageColor: '#56b686',
      pageBorderColor: '#56b686',
      pageBorderRadius: 10,
      paginationPrevNextBackgroundColor: 'transparent',
      paginationPrevNextColor: '#dfb628',
      paginationPrevNextBorderColor: '#dfb628',
      paginationPrevNextBorderRadius: 20,
      paginationFirstLastBackgroundColor: 'transparent',
      paginationFirstLastColor: '#d85749',
      paginationFirstLastBorderColor: '#d85749',
      paginationFirstLastBorderRadius: 0,
    };

  @Output() onPageChange = new EventEmitter<PageEvent>();

  @ContentChildren(DataTableColumnDirective)
  columnTemplateList!: QueryList<DataTableColumnDirective>;

  columnTemplates: { [key: string]: TemplateRef<any> } = {};
  actionsTemplate: TemplateRef<any> | null = null;

  ngAfterContentInit() {
    if (this.columnTemplateList) {
      this.columnTemplateList.forEach((item) => {
        if (item.columnName) {
          this.columnTemplates[item.columnName] = item.template;
          if (item.columnName === 'actions') {
            this.actionsTemplate = item.template;
          }
        }
      });
    }
  }

  getCustomStyles() {
    const styles: any = {};

    styles['--show-per-page-options-dropdown-value'] = this
      .showPerPageOptionsDropdown
      ? 'flex'
      : 'none';
    styles['--show-first-last-links-value'] = this.showFirstLastLinks
      ? 'flex'
      : 'none';
    styles['--show-prev-next-links-value'] = this.showPrevNextLinks
      ? 'flex'
      : 'none';

    styles['--page-selected-background'] =
      this.paginationCustomDesignProperties.pageSelectedBackgroundColor;
    styles['--page-selected-color'] =
      this.paginationCustomDesignProperties.pageSelectedColor;

    styles['--page-background'] =
      this.paginationCustomDesignProperties.pageBackgroundColor;
    styles['--page-color'] = this.paginationCustomDesignProperties.pageColor;
    styles['--page-border'] =
      this.paginationCustomDesignProperties.pageBorderColor;
    styles[
      '--page-border-radius'
    ] = `${this.paginationCustomDesignProperties.pageBorderRadius}px`;

    styles['--pagination-prev-next-background'] =
      this.paginationCustomDesignProperties.paginationPrevNextBackgroundColor;
    styles['--pagination-prev-next-color'] =
      this.paginationCustomDesignProperties.paginationPrevNextColor;
    styles['--pagination-prev-next-border'] =
      this.paginationCustomDesignProperties.paginationPrevNextBorderColor;
    styles[
      '--pagination-prev-next-border-radius'
    ] = `${this.paginationCustomDesignProperties.paginationPrevNextBorderRadius}px`;

    styles['--pagination-first-last-background'] =
      this.paginationCustomDesignProperties.paginationFirstLastBackgroundColor;
    styles['--pagination-first-last-color'] =
      this.paginationCustomDesignProperties.paginationFirstLastColor;
    styles['--pagination-first-last-border'] =
      this.paginationCustomDesignProperties.paginationFirstLastBorderColor;
    styles[
      '--pagination-first-last-border-radius'
    ] = `${this.paginationCustomDesignProperties.paginationFirstLastBorderRadius}px`;

    return styles;
  }

  handlePageChange(event: PaginatorState) {
    // Emit the page change event to parent component
    const pageEvent: PageEvent = {
      page: event.page! + 1,
      first: event.first ?? 0,
      limit: event.rows ?? 0,
      pageCount: Math.ceil(this.pagination.totalItems / (event.rows ?? 1)),
    };

    // You would typically emit this event to the parent component
    // This is a placeholder for the actual implementation
    this.onPageChange.emit(pageEvent);
  }

  getHeaderClass(column: ColumnDefinition, index: number) {
    return {
      'bg-primary-100 dark:bg-primary-950/60': true,
      'dark:bg-black': true,
      'text-gray-600': true,
      'dark:text-white': true,
      'rounded-tl-lg': index === 0,
      'rounded-tr-lg': index === this.columns.length,
      ...(column.headerClass ? this.parseClassString(column.headerClass) : {}),
    };
  }

  getBodyClass(column: ColumnDefinition) {
    return column.bodyClass ? this.parseClassString(column.bodyClass) : {};
  }

  // Helper method to parse class strings into objects for [ngClass]
  private parseClassString(classString: string): { [key: string]: boolean } {
    const result: { [key: string]: boolean } = {};
    if (classString) {
      classString.split(' ').forEach((cls) => {
        if (cls) result[cls] = true;
      });
    }
    return result;
  }
}
