import { signal } from '@angular/core';

import { Observable } from 'rxjs';

import { PageEvent } from '@interfaces/common/data-table.interface';
import {
  PaginatedResponse,
  Pagination,
  PaginationParams,
} from '@interfaces/common/pagination.interface';

export const usePagination = <TData, TParams = null, TDataTransform = any>(
  fetchData: (
    params: PaginationParams  & TParams
  ) => Observable<TData[] | PaginatedResponse<TData>>, // Function to fetch data
  defaultPerPage: number = 5,
  transformData?: (data: TData[]) => TDataTransform[] // This function is used to transform the data if necessary
) => {
  const pagination = signal<Pagination>({
    from: 0,
    page: 1,
    per_page: defaultPerPage,
    to: 0,
    totalItems: 0,
  });

  const paginationParams = signal<PaginationParams>({
    page: 1,
    per_page: 10,
    paginate: true,
  });

  const data = signal<TData[] | TDataTransform[]>([]); // Data to display in the table
  const filters = signal<TParams | null>(null); // To handle dynamic filters

  // Load data according to pagination and filters
  const loadData = (): void => {
    const params = {
      ...paginationParams(),
      ...filters(), //
    } as PaginationParams & TParams;

    fetchData(params).subscribe({
      next: (response: TData[] | PaginatedResponse<TData>) => {
        // If the response is paginated we set the data and pagination
        if ('data' in response) {
          data.set(response.data);
          pagination.set(response.pagination);
        } else {
          data.set(response);
        }
        // If we need or defined a function to transform the data
        if (transformData) {
          data.set(transformData(data() as TData[]));
        }
      },
      error: (error) => {
        console.error('Error en la carga de datos:', error);
      },
    });
  };

  // Función para cambiar de página
  const handlePageChange = async (event: PageEvent): Promise<void> => {
    data.set([]);
    paginationParams.set({
      page: event.page,
      per_page: event.per_page,
      paginate: true,
    });
    loadData();
  };

  // Función para actualizar filtros y resetear la paginación
  const setFilters = (newFilters: TParams) => {
    filters.set(newFilters);
    pagination.update((prevPagination) => ({
      ...prevPagination,
      page: 1,
    }));
    loadData();
  };

  return {
    pagination,
    data,
    handlePageChange,
    setFilters, // Función para establecer filtros
    loadData, // Permite recargar datos manualmente
  };
};
