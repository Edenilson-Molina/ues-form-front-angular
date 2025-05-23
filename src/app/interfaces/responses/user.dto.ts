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

export interface GetUsersDtoResponse {
  success:    boolean;
  message:    string;
  data:       RequestUser[];
  pagination: Pagination;
}

export interface RequestUser {
  id:                      number;
  id_usuario:              number;
  id_estado:               number;
  id_usuario_autoriza:     null;
  justificacion_solicitud: string;
  justificacion_rechazo:   null;
  created_at:              Date;
  updated_at:              Date;
  usuario:                 Usuario;
  estado:                  Estado;
}

export interface Estado {
  id:         number;
  nombre:     string;
  activo:     boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Usuario {
  id:                number;
  username:          string;
  email:             string;
  id_persona:        number;
  id_estado:         number;
  activo:            boolean;
  email_verified_at: Date;
  created_at:        Date;
  persona:           Persona;
}

export interface Persona {
  id:             number;
  nombre:         string;
  apellido:       string;
  identificacion: string;
  created_at:     Date;
}

export interface Pagination {
  from:         number;
  to:           number;
  per_page:     number;
  page:         number;
  nextPage:     null;
  previousPage: null;
  totalPages:   number;
  totalItems:   number;
}

export interface User {
  id:         number;
  username:   string;
  email:      string;
  id_persona: number;
  id_estado:  number;
  persona:    PersonaUser;
  estado:     EstadoUser;
}

export interface EstadoUser {
  id:     number;
  nombre: string;
}

export interface PersonaUser {
  id:       number;
  nombre:   string;
  apellido: string;
}

export interface EditUserAdmin {
  success: boolean;
  message: string;
  data:    DataUser;
}

export interface DataUser {
  id:                number;
  username:          string;
  email:             string;
  id_persona:        number;
  id_estado:         number;
  activo:            boolean;
  email_verified_at: Date;
  created_at:        Date;
  updated_at:        Date;
  persona:           PersonaDataUser;
  estado:            EstadoDataUser;
  roles:             RoleDataUser[];
}

export interface EstadoDataUser {
  id:     number;
  nombre: string;
}

export interface PersonaDataUser {
  id:       number;
  nombre:   string;
  apellido: string;
}

export interface RoleDataUser {
  id:          number;
  name:        string;
  guard_name:  string;
  created_at:  Date;
  updated_at:  Date;
  activo:      boolean;
  description: string;
  pivot:       PivotDataUser;
}

export interface PivotDataUser {
  model_type: string;
  model_id:   number;
  role_id:    number;
}


