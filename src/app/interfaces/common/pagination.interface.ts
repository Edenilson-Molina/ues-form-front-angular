import { WritableSignal } from '@angular/core';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginationParams {
  page: number;
  limit: number;
  paginate?: boolean;
}

export interface PaginationTableOutput {
  /**
     * Index of first record
     */
  first: number;
  /**
   * Number of rows to display in new page
   */
  rows: number;
  /**
   * New page number
   */
  page: number;
  /**
   * Total number of pages
   */
  pageCount?: number;
}

export interface Pagination {
  from: number;
  to: number;
  limit: number;
  page: number;
  nextPage?: number | null;
  previousPage?: number | null;
  totalPages?: number;
  totalItems: number;
}


