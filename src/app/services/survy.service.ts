import { Injectable } from '@angular/core';

import { LoginDto, requestRegisterDto, sendVerificationEmailDto, verifyEmailDto } from '@interfaces/request/auth.dto';
import { LoginResponse, requestRegisterResponse, sendVerificationEmailResponse, verifyEmailResponse } from '@interfaces/responses/auth.dto';
import { getAxiosAdapter } from './common/axios.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';
import { environment } from '@environments/environment';
import { AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { requestSurvyDto } from '@app/interfaces/request/survy.dto';


@Injectable({
  providedIn: 'root'
})
export class SurvyService {
  private axiosService = getAxiosAdapter()

  async getSurveys(requestParams: requestSurvyDto) {
    const params = [
      requestParams.paginate ? `paginate=${requestParams.paginate}` : 'paginate=true',
      requestParams.page ? `page=${requestParams.page}` : 1,
      requestParams.per_page ? `per_page=${requestParams.per_page}` : 10,
      requestParams.titulo ? `titulo=${requestParams.titulo}` : '',
      requestParams.grupo_meta ? `grupo_meta=${requestParams.grupo_meta}` : '',
      requestParams.id_estado ? `id_estado=${requestParams.id_estado}` : ''
    ].filter(Boolean).join('&');
    const filter = params ? `${params}` : '';
    return await this.axiosService.get(`/encuestas?${filter}`);
  }

  async createSurvey() {
    return await this.axiosService.post('/encuestas/init-survey');
  }

  async getSurveyById(id: number) {
    return await this.axiosService.get(`/encuestas/editor/form/${id}`);
  }
}
