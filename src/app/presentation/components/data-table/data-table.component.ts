import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterContentInit,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
  ContentChild,
  Directive,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';

export interface PaginationInterface {
  from: number;
  page: number;
  perPage: number;
  to: number;
  total: number;
}

export interface ActionButtonConfiguration {
  icon: string;
  label: string;
  class: string;
  onClick: (data: any) => void;
}

export interface ColumnDefinition {
  field: string;
  header: string;
  sortable?: boolean;
  style?: any;
  class?: string;
  headerStyle?: any;
  headerClass?: string;
  bodyStyle?: any;
  bodyClass?: string;
  footer?: string;
  footerStyle?: any;
  footerClass?: string;
}

export interface PaginationCustomDesignProperties {
  pageSelectedBackgroundColor: string;
  pageSelectedColor: string;
  pageBackgroundColor: string;
  pageColor: string;
  pageBorderColor: string;
  pageBorderRadius: number;
  paginationPrevNextBackgroundColor: string;
  paginationPrevNextColor: string;
  paginationPrevNextBorderColor: string;
  paginationPrevNextBorderRadius: number;
  paginationFirstLastBackgroundColor: string;
  paginationFirstLastColor: string;
  paginationFirstLastBorderColor: string;
  paginationFirstLastBorderRadius: number;
}

// Create custom directives for our templates
@Directive({
  selector: '[dataTableColumn]',
  standalone: true,
})
export class DataTableColumnDirective {
  @Input('dataTableColumn') columnName!: string;
  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  selector: '[dataTableActions]',
  standalone: true,
})
export class DataTableActionsDirective {
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
    DataTableColumnDirective,
    DataTableActionsDirective,
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
  @Input() scrollHeight: string = '400px';
  @Input() showPagination: boolean = true;
  @Input() showPerPageOptionsDropdown: boolean = true;
  @Input() showPrevNextLinks: boolean = false;
  @Input() showFirstLastLinks: boolean = false;
  @Input() headerAlign: string = 'start';
  @Input() actionsAlign: string = 'start';
  @Input() rowsPerPageOptions: number[] = [2, 5, 10, 15];
  @Input() actionButtonsConfiguration: ActionButtonConfiguration[] = [];
  @Input() pagination: PaginationInterface = {
    from: 0,
    page: 1,
    perPage: 2,
    to: 0,
    total: 0,
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

    @ContentChildren(DataTableColumnDirective) columnTemplateList!: QueryList<DataTableColumnDirective>;
    @ContentChild(DataTableActionsDirective) actionsTemplateDirective?: DataTableActionsDirective;

    columnTemplates: { [key: string]: TemplateRef<any> } = {};
    actionsTemplate: TemplateRef<any> | null = null;

  ngAfterContentInit() {
    // Process column templates
    if (this.columnTemplateList) {
      this.columnTemplateList.forEach((item) => {
        if (item.columnName) {
          this.columnTemplates[item.columnName] = item.template;
          console.log(`Template for column ${item.columnName} loaded`);
        }
      });

      console.log(
        'Loaded column templates:',
        Object.keys(this.columnTemplates)
      );
    }

    // Process actions template
    if (this.actionsTemplateDirective) {
      this.actionsTemplate = this.actionsTemplateDirective.template;
      console.log('Actions template loaded');
    }
  }

  hasColumnTemplate(columnField: string): boolean {
    return !!this.columnTemplates[columnField];
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

  handlePageChange(event: any) {
    // Emit the page change event to parent component
    const pageEvent = {
      page: event.page + 1,
      first: event.first,
      rows: event.rows,
      pageCount: Math.ceil(this.pagination.total / event.rows),
    };

    // You would typically emit this event to the parent component
    // This is a placeholder for the actual implementation
    console.log('Page changed:', pageEvent);
  }

  getHeaderClass(column: ColumnDefinition, index: number) {
    return {
      'bg-primary-100': true,
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

  getFooterClass(column: ColumnDefinition) {
    return column.footerClass ? this.parseClassString(column.footerClass) : {};
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
