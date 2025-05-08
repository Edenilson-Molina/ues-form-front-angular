export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface sendVerificationEmailResponse {
  success: string;
  message: string;
  data: {
    email: string;
    expiration_date: string;
  };
}

export interface verifyEmailResponse {
  success: string;
  message: string;
  data: {
    email: string;
    verification_code: string;
  };
}

export interface requestRegisterResponse {
  success: string;
  message: string;
  data?: [];
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    nombre?: string[];
    apellido?: string[];
    identificacion?: string[];
    justificacion_solicitud?: string[];
  };
}
