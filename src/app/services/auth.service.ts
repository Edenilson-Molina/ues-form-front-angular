import { Injectable } from '@angular/core';

import { LoginDto, requestRegisterDto, sendVerificationEmailDto, verifyEmailDto } from '@interfaces/request/auth.dto';
import { LoginResponse, requestRegisterResponse, sendVerificationEmailResponse, verifyEmailResponse } from '@interfaces/responses/auth.dto';
import { getAxiosAdapter } from './common/axios.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';
import { environment } from '@environments/environment';
import { AxiosRequestConfig } from 'axios';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private axiosService = getAxiosAdapter()

  constructor(private store: Store<{session: Session}>) {}

  async sendVerificationEmail(sendVerificationEmailDto: sendVerificationEmailDto) {
    const config: AxiosRequestConfig = {
      baseURL: `${environment.apiPublic}` || 'http://localhost:8321/public'
    }
    return await this.axiosService.post<sendVerificationEmailDto,sendVerificationEmailResponse>('/auth/send-verify-email', sendVerificationEmailDto, config);
  }

  async verifyEmail(verifyEmailDto: verifyEmailDto) {
    const config: AxiosRequestConfig = {
      baseURL: `${environment.apiPublic}` || 'http://localhost:8321/public'
    }
    return await this.axiosService.post<verifyEmailDto, verifyEmailResponse>('/auth/verify-email', verifyEmailDto, config);
  }

  async requestRegister(requestRegisterDto: requestRegisterDto) {
    const config: AxiosRequestConfig = {
      baseURL: `${environment.apiPublic}` || 'http://localhost:8321/public'
    }
    return await this.axiosService.post<requestRegisterDto,requestRegisterResponse>('/auth/request-registration', requestRegisterDto, config);
  }

  async requestUnlockUser({ justificacion_solicitud }: {justificacion_solicitud: string}) {
    return await this.axiosService.post('/auth/solicitudes-desbloqueo/request-unlocking', { justificacion_solicitud });
  }

  async login(loginDto: LoginDto) {
    const config: AxiosRequestConfig = {
      baseURL: `${environment.apiPublic}` || 'http://localhost:8321/public'
    }
    return await this.axiosService.post<LoginDto, LoginResponse>('/auth/login', loginDto, config);
  }

  async logout() {
    return await this.axiosService.post('/auth/logout');
  }

  isAuthenticated(): Observable<boolean> {
    return this.store.select(state => state.session).pipe(
      map(session => !!session.accessToken && !this.isTokenExpired(session.accessToken) && session.isUnlocked)
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expiry;
    } catch (e) {
      return true; // Si hay error, considera el token como expirado
    }
  }
}
