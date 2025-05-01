import { Injectable } from '@angular/core';

import { LoginDto } from '@interfaces/request/auth.dto';
import { LoginResponse } from '@interfaces/responses/auth.dto';
import { getAxiosAdapter } from './common/axios.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Session } from '@app/interfaces/store';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private axiosService = getAxiosAdapter()

  constructor(private store: Store<{session: Session}>) {}

  async login(loginDto: LoginDto) {
    return await this.axiosService.post<LoginDto, LoginResponse>('/auth/login', loginDto);
  }

  async logout() {
    return await this.axiosService.post('/auth/logout');
  }

  isAuthenticated(): Observable<boolean> {
    return this.store.select(state => state.session).pipe(
      map(session => !!session.accessToken && !this.isTokenExpired(session.accessToken))
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
