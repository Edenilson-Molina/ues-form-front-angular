import { WritableSignal } from '@angular/core';

export interface PaginationInterface {
  totalPages: number;
  limit: number;
  totalItems: number;
  page: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInterface;
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

export interface PaginationTableInput {
  from: number;
  to: number;
  total: number;
  limit: number;
  page: number;
  nextPage: number | null;
  previousPage: number | null;
  totalPages?: number;
  totalItems?: number;
}


