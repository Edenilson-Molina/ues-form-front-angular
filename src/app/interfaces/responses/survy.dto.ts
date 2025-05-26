export interface UpdateInternatDataSurveyDto {
  success: boolean;
  message: string;
  data:    Data;
}

export interface UpdateGeneralInfoSurveyDto {
  success: boolean;
  message: string;
  data:    Data;
}

export interface Data {
  id:                number;
  id_usuario:        number;
  id_grupo_meta:     number;
  id_estado:         number;
  codigo:            string;
  titulo:            string;
  objetivo:          string;
  descripcion:       string;
  fecha_publicacion: null;
  created_at:        Date;
  updated_at:        Date;
  deleted_at:        null;
}

export interface GetSurveysDtoResponse {
  success:    boolean;
  message:    string;
  data:       SurveyDto[];
  pagination: Pagination;
}

export interface SurveyDto {
  id:                number;
  id_usuario:        number;
  id_grupo_meta:     number | null;
  id_estado:         number;
  codigo:            string;
  titulo:            string;
  objetivo:          string;
  descripcion:       string;
  fecha_publicacion: null;
  created_at:        Date;
  updated_at:        Date;
  deleted_at:        null;
  grupo_meta:        GrupoMeta;
  user:              User;
  estado:            Estado;
}


export interface GrupoMeta {
  id:     number;
  nombre: string;
}

export interface Estado {
  id:     number;
  nombre: string;
}

export interface User {
  id:       number;
  username: string;
  email:    string;
}

export interface Pagination {
  from:         number;
  to:           number;
  per_page:     number;
  page:         number;
  nextPage:     number;
  previousPage: null;
  totalPages:   number;
  totalItems:   number;
}

