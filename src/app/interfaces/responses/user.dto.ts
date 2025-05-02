export interface UserResponse {
  status: string;
  message: string;
  data: UserData[];
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}