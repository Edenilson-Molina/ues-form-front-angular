export interface UserData {
  username: string;
  email: string;
  name: string;
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
}

export interface Session {
  user: UserData | null;
  accessToken: string | null;
  isUnlocked: boolean;
  isLoading: boolean;
  darkMode: boolean;
  showMenu: boolean;
  // person: Person | null;
  // company: Company | null;
}

export interface RequestRegisterState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellido: string;
  identificacion: string;
  justificacion_solicitud: string;
}
