import { WritableSignal } from '@angular/core';

export interface PaginatedResponse<T> {
  success?: boolean;
  message?: string;
  errors?: string[];
  data: T[];
  pagination: Pagination;
}

export interface PaginationParams {
  page: number;
  per_page: number;
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
  per_page: number;
  page: number;
  nextPage?: number | null;
  previousPage?: number | null;
  totalPages?: number;
  totalItems: number;
}


