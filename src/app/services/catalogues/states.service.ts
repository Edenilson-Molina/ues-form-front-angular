import { Injectable } from '@angular/core';
import { getAxiosAdapter } from '../common/axios.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private axiosAdapter = getAxiosAdapter();

  async getStates(scope: string){
    return await this.axiosAdapter.get(`catalogo/estados?scope=${scope}`);
  }
}
