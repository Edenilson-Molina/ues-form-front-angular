import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import type { HttpAdapter } from '@interfaces/index';

import { environment } from '@environments/environment';

import { sendNotification, ToastType } from './sonner-adapter';
import { Session } from '@interfaces/store';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { isLoading } from '@app/store/auth.actions';
import { LOCAL_STORAGE } from '@app/utils/constants.utils';

export class AxiosAdapter implements HttpAdapter<AxiosRequestConfig> {
  private axios: AxiosInstance;
  private store = inject(Store);
  private sessionStore!: Session

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionStore = session;
    });

    this.axios = axios.create({
      baseURL: environment.api || 'http://localhost:4000/api',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    this.axios.interceptors.request.use((config) => {
      this.store.dispatch(isLoading(true));
      if (this.sessionStore?.token) {
        config.headers.Authorization = `Bearer ${this.sessionStore.token}`;
      }
      return config;
    }),
      (error: AxiosError) => {
        return Promise.reject(error);
      };
  }

  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleRequest<TResponse>(
      this.axios.get<TResponse>(url, config)
    );
  }

  async post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleRequest<TResponse>(
      this.axios.post<TResponse>(url, data, config)
    );
  }

  async put<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleRequest<TResponse>(
      this.axios.put<TResponse>(url, data, config)
    );
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleRequest<TResponse>(
      this.axios.delete<TResponse>(url, config)
    );
  }

  async request<TResponse>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleRequest<TResponse>(
      this.axios.request<TResponse>({ method, url, data, ...config })
    );
  }

  async setHeaders(headers: Record<string, string>): Promise<void> {
    this.axios.defaults.headers = {
      ...this.axios.defaults.headers,
      ...headers,
    };
  }

  private async handleRequest<TResponse>(
    request: Promise<AxiosResponse<TResponse>>
  ): Promise<TResponse> {

    try {
      const response = await request;
      this.store.dispatch(isLoading(false));
      return response.data;
    } catch (error: any) {
      this.store.dispatch(isLoading(false));
      let message: string = '';
      let summary = '';
      let type: ToastType = 'error';
      let details: string[] = [];

      switch (error.response.status) {
        case 0:
          summary = 'Error de conexión';
          message = 'No se pudo conectar con el servidor';
          break;
        case 300:
          return Promise.reject(error);
        case 500:
          summary = 'Error de servidor';
          message = 'Error';
          break;
        case 401:
          if (!localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)) {
            summary = 'Advertencia';
            message = error.response.data.message ?? 'Acceso no autorizado';
          } else {
            try {
              const response = await axios.post(
                `${environment.api}/v1/auth/refresh-token`,
                {
                  refreshToken: localStorage.getItem(
                    LOCAL_STORAGE.REFRESH_TOKEN
                  ),
                }
              );
              localStorage.setItem(
                LOCAL_STORAGE.ACCESS_TOKEN,
                response.data.accesToken
              );
              localStorage.setItem(
                LOCAL_STORAGE.REFRESH_TOKEN,
                response.data.refreshToken
              );

              const config = error.config;
              config.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return axios.request(config);
            } catch (error) {
              localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
              localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
              window.location.href = '/auth/login';
              return Promise.reject(error);
            }
          }
          break;
        default:
          if (error.response?.status >= 400 && error.response?.status < 500) {
            if (error.response?.data?.message) {
              message = error.response?.data?.message;
              details = error.response?.data?.details;
            } else if (error.response?.data?.error) {
              message = error.response?.data?.error;
              details = error.response?.data?.details;
            }
            summary = 'Advertencia';
          } else {
            message = error.response.statusText;
          }
          break;
      }

      // Mostrar notificación en el UI
      sendNotification({
        type: type,
        summary: summary,
        message: message,
      });

      if(details.length > 0) {
        details.forEach((detail) => {
          sendNotification({
            type: type,
            summary: summary,
            message: detail,
          });
        });
      }

      return Promise.reject(error);
    }
  }
}
