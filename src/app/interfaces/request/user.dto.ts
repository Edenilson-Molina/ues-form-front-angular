export interface UserParams {
  email?: string;
  name?: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}
