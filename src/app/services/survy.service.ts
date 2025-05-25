import { Injectable } from '@angular/core';
import { getAxiosAdapter } from './common/axios.service';
import { putFormSurvyDto, putGeneralInfoSurvyDto, putInternalDataSurvyDto, requestSurvyDto } from '@app/interfaces/request/survy.dto';
import { GetSurveysDtoResponse, UpdateGeneralInfoSurveyDto, UpdateInternatDataSurveyDto } from '@app/interfaces/responses/survy.dto';
import { AxiosRequestConfig } from 'axios';
import { environment } from '@environments/environment';

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
    return await this.axiosService.get<GetSurveysDtoResponse>(`/encuestas?${filter}`);
  }

  async createSurvey() {
    return await this.axiosService.post('/encuestas/init-survey');
  }

  async getSurveyById(id: number) {
    return await this.axiosService.get(`/encuestas/editor/form/${id}`);
  }

  async getInternalDataSurvey(id: number) {
    return await this.axiosService.get(`/encuestas/editor/internal-data/${id}`);
  }

  async getGeneralInfoSurvey(id: number) {
    return await this.axiosService.get(`/encuestas/editor/general-info/${id}`);
  }

  async putInternalDataSurvey(id: number, data: putInternalDataSurvyDto) {
    return await this.axiosService.put<putInternalDataSurvyDto, UpdateInternatDataSurveyDto>(`/encuestas/editor/internal-data/${id}`, data);
  }

  async putGeneralInfoSurvey(id: number, data: putGeneralInfoSurvyDto) {
    return await this.axiosService.put<putGeneralInfoSurvyDto, UpdateGeneralInfoSurveyDto>(`/encuestas/editor/general-info/${id}`, data);
  }

  async putFormSurvey(id: number, formulario: putFormSurvyDto[]) {
    return await this.axiosService.put(`/encuestas/editor/form/${id}`, {
      formulario
    });
  }

  async publicFormSurvey(id: number) {
    return await this.axiosService.put(`/encuestas/publish/${id}`);
  }

  async showSurvey(codigo: string) {
    const config: AxiosRequestConfig = {
      baseURL: `${environment.apiPublic}` || 'http://localhost:8321/public'
    }
    return await this.axiosService.get(`/external/show-survey/${codigo}`, config);
  }

  async answerSurvey(data: any) {
    const config: AxiosRequestConfig = {
      baseURL: `${environment.apiPublic}` || 'http://localhost:8321/public'
    }
    return await this.axiosService.post(`/external/answer-survey`, data, config);
  }

  async getStatisticsSurvey(id: number) {
    return await this.axiosService.get(`/encuestas/statistics/${id}`);
  }
}
