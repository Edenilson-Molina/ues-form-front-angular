import { inject, Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';

import { getAxiosAdapter } from './common/axios.service';

import {
  PaginatedResponse,
  PaginationParams,
} from '@interfaces/common/pagination.interface';
import { UserResponse } from '@interfaces/responses/user.dto';
import { CreateUserDto, UserParams } from '@app/interfaces/request/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private axiosAdapter = getAxiosAdapter();

  getAllUsers(params: PaginationParams & UserParams): Observable<UserResponse[] | PaginatedResponse<UserResponse>> {
    return from(
      this.axiosAdapter.get<UserResponse[] | PaginatedResponse<UserResponse>>(
      '/auth/users', { params }
      )
    );
  }

  createUser(user: CreateUserDto): Observable<UserResponse> {
    return from(
      this.axiosAdapter.post<CreateUserDto, UserResponse>('/users', user)
    );
  }
}
