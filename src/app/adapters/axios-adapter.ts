import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';

import { environment } from '@environments/environment';

import { Session } from '@interfaces/store';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { sendNotification, ToastType } from '@adapters/sonner-adapter';
import { isLoading, login, resetState } from '@store/auth.actions';

import type { HttpAdapter } from '@interfaces/index';

let isRefreshing = false;
let refreshSubscribers: unknown[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => {
    if (typeof callback === 'function') {
      callback(token);
    }
  });
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: unknown) {
  refreshSubscribers.push(callback);
}

export class AxiosAdapter implements HttpAdapter<AxiosRequestConfig> {
  private axios: AxiosInstance;
  private store = inject(Store);
  private router = inject(Router);
  private sessionStore!: Session;

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionStore = session;
    });

    this.axios = axios.create({
      baseURL: `${environment.api}` || 'http://localhost:8321/api',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    this.axios.interceptors.request.use((config) => {
      this.store.dispatch(isLoading(true));
      if (this.sessionStore?.accessToken) {
        config.headers.Authorization = `Bearer ${this.sessionStore.accessToken}`;
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
      const originalRequest = error.config;
      this.store.dispatch(isLoading(false));
      let message: string = '';
      let errors: {};
      let summary = '';
      let type: ToastType = 'error';
      let details: Record<string, string[]> = {};

      if (error.code === 'ERR_NETWORK') {
        summary = 'Error de conexión';
        message = 'No se pudo conectar con el servidor';
      }

      switch (error.response?.status) {
        case 300:
          return Promise.reject(error);
        case 500:
          summary = 'Error de servidor';
          message = 'Error';
          break;
        case 401:
          summary = 'Advertencia';
          message = error.response.data.message ?? 'Acceso no autorizado';
          if (
            this.router.url !== '/login' &&
            this.router.url !== '/request-register' &&
            !originalRequest._retry
          ) {
            try {

              // Para manejar multiples solicitudes de refresh
              if (isRefreshing) {
                return new Promise((resolve) => {
                  addRefreshSubscriber((token: string) => {
                    originalRequest.headers['Authorization'] =
                      'Bearer ' + token;
                    resolve(axios(originalRequest));
                  });
                });
              }
              isRefreshing = true;
              originalRequest._retry = true;


              const response = await axios.post(
                `${environment.api}/auth/refresh`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${this.sessionStore.accessToken}`,
                  },
                }
              );
              this.store.dispatch(
                login(response.data.accessToken, this.sessionStore.isUnlocked)
              );

              onRefreshed(response.data.accessToken);
              isRefreshing = false;

              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return (await axios.request(originalRequest)).data;
            } catch (error: any) {
              isRefreshing = false;
              this.store.dispatch(resetState());
              this.router.navigate(['login']);
              if (
                error.response?.data?.message &&
                error.response?.status >= 400 &&
                error.response?.status < 500
              ) {
                if (error.response?.data?.details) {
                  details = error.response?.data?.details;
                }
              }
            }
          }
          break;
        default:
          if (error.response?.status >= 400 && error.response?.status < 500) {
            if (error.response?.data?.message) {
              message = error.response?.data?.message;
              if (error.response?.data?.errors) {
                details = error.response?.data?.errors;
              }
            }
            summary = 'Advertencia';
          } else {
            console.error(error);
            if (!message) message = error?.response?.statusText || 'Error';
          }
          break;
      }

      // Mostrar notificación en el UI
      if (typeof details === 'string') {
        sendNotification({
          type: type,
          summary: summary,
          message: message,
          description: details, // Usar el string directamente
        });
      } else if (
        typeof details === 'object' &&
        details !== null &&
        Object.keys(details).length > 0
      ) {
        Object.keys(details).forEach((key) => {
          sendNotification({
            type: type,
            summary: summary,
            message: message,
            description: Array.isArray(details[key])
              ? details[key][0]
              : details[key], // Manejar array o valor directo
          });
        });
      } else {
        sendNotification({
          type: type,
          summary: summary,
          message: message,
        });
      }

      return Promise.reject(error);
    }
  }
}
