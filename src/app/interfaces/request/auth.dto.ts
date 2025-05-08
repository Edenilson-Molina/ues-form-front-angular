export interface LoginDto {
  email: string;
  password: string;
}

export interface sendVerificationEmailDto {
  email: string;
}

export interface verifyEmailDto {
  email: string;
  verification_code: string;
}

export interface requestRegisterDto {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  identificacion: string;
  justificacion_solicitud: string;
}

