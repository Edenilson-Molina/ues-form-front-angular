import { Injectable } from '@angular/core';

import { getAxiosAdapter } from '../common/axios.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';
import { environment } from '@environments/environment';
import { AxiosRequestConfig } from 'axios';
import { TargetGroupDto } from '@app/interfaces/responses/target-group.dto';
import { requestTargetGroupDto } from '@app/interfaces/request/target-group';


@Injectable({
  providedIn: 'root'
})
export class TargetGroupService {
  private axiosService = getAxiosAdapter()

  constructor(private store: Store<{session: Session}>) {}

  async getTargetGroup(requestTargetGroupDto: requestTargetGroupDto) {
    const filters = [];
    if (requestTargetGroupDto.filterName) {
      filters.push({ field: 'nombre', operator: 'like', value: `%${requestTargetGroupDto.filterName}%` });
    }
    if (requestTargetGroupDto.filterState !== null && requestTargetGroupDto.filterState !== undefined) {
      filters.push({ field: 'activo', operator: '=', value: requestTargetGroupDto.filterState });
    }

    if (filters.length > 0) {
      return await this.axiosService.post(`catalogo/grupos-meta/search?page=${requestTargetGroupDto.page}`, { filters });
    } else if (requestTargetGroupDto.page) {
      return await this.axiosService.get(`catalogo/grupos-meta?page=${requestTargetGroupDto.page}`);
    } else {
      return await this.axiosService.get(`catalogo/grupos-meta?pagination=${requestTargetGroupDto.paginate}`);
    }
  }

  async updateTargetGroup(data: TargetGroupDto) {
    return await this.axiosService.put(`catalogo/grupos-meta/${data.id}`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado
    });
  }

  async createTargetGroup(data: TargetGroupDto) {
    return await this.axiosService.post(`catalogo/grupos-meta`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado
    });
  }
}
