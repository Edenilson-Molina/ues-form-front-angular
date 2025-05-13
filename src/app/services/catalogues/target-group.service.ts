import { Injectable } from '@angular/core';

import { LoginDto, requestRegisterDto, sendVerificationEmailDto, verifyEmailDto } from '@interfaces/request/auth.dto';
import { LoginResponse, requestRegisterResponse, sendVerificationEmailResponse, verifyEmailResponse } from '@interfaces/responses/auth.dto';
import { getAxiosAdapter } from '../common/axios.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';
import { environment } from '@environments/environment';
import { AxiosRequestConfig } from 'axios';
import { TargetGroupData } from '@app/interfaces/responses/target-group.dto';


@Injectable({
  providedIn: 'root'
})
export class TargetGroupService {
  private axiosService = getAxiosAdapter()

  constructor(private store: Store<{session: Session}>) {}

  async getTargetGroup(page?: number, filterName?: string, filterState?: boolean | null) {
    if(page && filterName && filterState !== null) {
      return await this.axiosService.post(`catalogo/grupos-meta/search?page=${page}`, {
        filters: [
          { field: 'nombre', operator: 'like', value: `%${filterName}%` },
          { field: 'estado', operator: '=', value: filterState },
        ]
      });
    }else if(page && filterState !== null) {
      return await this.axiosService.post(`catalogo/grupos-meta/search?page=${page}`, {
        filters: [
          { field: 'estado', operator: '=', value: filterState },
        ]
      });
    } else if (page && filterName) {
      return await this.axiosService.post(`catalogo/grupos-meta/search?page=${page}`, {
        filters: [
          { field: 'nombre', operator: 'like', value: `%${filterName}%` },
        ]
      });
    } else{
      return await this.axiosService.get(`catalogo/grupos-meta?page=${page ? page : 1}`);
    }
  }

  async updateTargetGroup(data: TargetGroupData) {
    return await this.axiosService.put(`catalogo/grupos-meta/${data.id}`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado
    });
  }

  async createTargetGroup(data: TargetGroupData) {
    return await this.axiosService.post(`catalogo/grupos-meta`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado
    });
  }
}
