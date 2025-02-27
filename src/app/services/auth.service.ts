import { Injectable } from '@angular/core';

import { LoginDto } from '@interfaces/request/auth.dto';
import { LoginResponse } from '@interfaces/responses/auth.dto';
import { getAxiosAdapter } from './common/axios.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private axiosService = getAxiosAdapter()
  constructor() {}

  async login(loginDto: LoginDto) {
    return await this.axiosService.post<LoginDto, LoginResponse>('/auth/login', loginDto);
  }
}
