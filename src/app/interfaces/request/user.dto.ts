export interface UserParams {
  email?: string;
  name?: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface requestUsersDto {
  page?: number;
  per_page?: number;
  paginate?: boolean;
  nombre_usuario?: string;
  id_estado?: number | null;
}
