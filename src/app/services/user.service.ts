import { inject, Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';

import { getAxiosAdapter } from './common/axios.service';

import {
  PaginatedResponse,
  PaginationParams,
} from '@interfaces/common/pagination.interface';
import { GetUsersDtoResponse, UserResponse } from '@interfaces/responses/user.dto';
import { CreateUserDto, requestUsersDto, UserParams } from '@app/interfaces/request/user.dto';
import { requestRolesDto } from '@app/interfaces/request/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private axiosAdapter = getAxiosAdapter();

  getUsersTest(params: PaginationParams & UserParams): Observable<UserResponse[] | PaginatedResponse<UserResponse>> {
    return from(
      this.axiosAdapter.get<UserResponse[] | PaginatedResponse<UserResponse>>(
        '/auth/users', { params }
      )
    );
  }

  createUser(user: CreateUserDto): Observable<UserResponse> {
    return from(
      this.axiosAdapter.post<CreateUserDto, UserResponse>('/users', user)
    );
  }

  async getAllUsers(requestParams: requestUsersDto) {
    const params = [
      requestParams.paginate ? `paginate=${requestParams.paginate}` : 'paginate=true',
      requestParams.page ? `page=${requestParams.page}` : 1,
      requestParams.per_page ? `per_page=${requestParams.per_page}` : 10,
      requestParams.nombre_usuario ? `nombre_usuario=${requestParams.nombre_usuario}` : '',
      requestParams.id_estado ? `id_estado=${requestParams.id_estado}` : '',
    ].filter(Boolean).join('&');
    const filter = params ? `${params}` : '';
    return await this.axiosAdapter.get(`/auth/users?${filter}`);
  }

  async getUsersFiltered(requestParams: requestUsersDto) {
    const params = [
      requestParams.paginate ? `paginate=${requestParams.paginate}` : 'paginate=true',
      requestParams.page ? `page=${requestParams.page}` : 1,
      requestParams.per_page ? `per_page=${requestParams.per_page}` : 10,
      requestParams.nombre_usuario ? `nombre_usuario=${requestParams.nombre_usuario}` : '',
      requestParams.id_estado ? `id_estado=${requestParams.id_estado}` : '',
    ].filter(Boolean).join('&');
    const filter = params ? `${params}` : '';
    return await this.axiosAdapter.get<GetUsersDtoResponse>(`/auth/solicitudes-registro?${filter}`);
  }

  async updateRegisterUser(id: number, id_estado: number, justificacion_rechazo: string) {
    return await this.axiosAdapter.put(`/auth/solicitudes-registro/${id}`,
      {
        id_estado,
        justificacion_rechazo,
      }
    );
  }

  async updateUser(id: number, id_estado: number, roles: string[]) {
    return await this.axiosAdapter.put(`/auth/users/${id}`,
      {
        id_estado,
        roles,
      }
    );
  }

  async getRoles(requestRolesDto: requestRolesDto) {
      const params = [
        requestRolesDto.paginate ? `paginate=${requestRolesDto.paginate}` : 'paginate=false',
        requestRolesDto.page ? `page=${requestRolesDto.page}` : '',
        requestRolesDto.per_page ? `per_page=${requestRolesDto.per_page}` : '',
        requestRolesDto.estado ? `estado=${requestRolesDto.estado}` : '',
        requestRolesDto.name ? `name=${requestRolesDto.name}` : ''
      ].filter(Boolean).join('&');
      const filter = params ? `${params}` : '';
      return await this.axiosAdapter.get(`/auth/roles?${filter}`);
    }
}
