import { Injectable } from '@angular/core';

import { LoginDto, requestRegisterDto, sendVerificationEmailDto, verifyEmailDto } from '@interfaces/request/auth.dto';
import { LoginResponse, requestRegisterResponse, sendVerificationEmailResponse, verifyEmailResponse } from '@interfaces/responses/auth.dto';
import { getAxiosAdapter } from '../common/axios.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';
import { environment } from '@environments/environment';
import { AxiosRequestConfig } from 'axios';


@Injectable({
  providedIn: 'root'
})
export class TargetGroupService {
  private axiosService = getAxiosAdapter()

  constructor(private store: Store<{session: Session}>) {}

  async getTargetGroup() {
    return await this.axiosService.get('/catalogo/grupos-meta');
  }

  async getTargetGroupPaginated(page: number) {
    return await this.axiosService.get(`catalogo/grupos-meta?page=${page}`);
  }
}
