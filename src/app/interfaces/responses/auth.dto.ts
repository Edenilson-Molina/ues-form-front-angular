export interface LoginResponse {
  accessToken: string;
  isUnlocked: boolean;
}

export interface sendVerificationEmailResponse {
  success: string;
  message: string;
  data: {
    email: string;
    expiration_date: string;
    verified_previously?: boolean;
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
