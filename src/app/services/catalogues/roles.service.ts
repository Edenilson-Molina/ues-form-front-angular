import { Injectable } from '@angular/core';
import { getAxiosAdapter } from '../common/axios.service';
import { requestRolesDto } from '@app/interfaces/request/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor() {}

  private axiosAdapter = getAxiosAdapter();

  async getAllRoles(requestRolesDto: requestRolesDto) {
    const params = [
      requestRolesDto.paginate ? `paginate=${requestRolesDto.paginate}` : 'paginate=false',
      requestRolesDto.page ? `page=${requestRolesDto.page}` : '',
      requestRolesDto.per_page ? `per_page=${requestRolesDto.per_page}` : '',
      requestRolesDto.estado !== null ? `estado=${requestRolesDto.estado}` : '',
      requestRolesDto.name ? `name=${requestRolesDto.name}` : ''
    ].filter(Boolean).join('&');
    const filter = params ? `${params}` : '';
    return await this.axiosAdapter.get(`/auth/roles?${filter}`);
  }

  async updateRole(id: number, data: any) {
    return await this.axiosAdapter.put(`/auth/roles/${id}`, data);
  }

  async createRole(data: any) {
    return await this.axiosAdapter.post('/auth/roles', data);
  }


}
