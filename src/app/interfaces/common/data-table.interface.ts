export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  style?: Record<string, string>;
  class?: string;
  headerStyle?: Record<string, string>;
  headerClass?: string;
  align?: string;
}

export interface ActionButtonConfiguration {
  icon: string;
  label: string;
  severity?: string;
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

export interface PageEvent {
  first: number;
  limit: number;
  page: number;
  pageCount: number;
}
