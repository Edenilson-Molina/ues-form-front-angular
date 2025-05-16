export interface requestSurvyDto{
  page?: number;
  per_page?: number;
  paginate?: boolean;
  titulo?: string;
  grupo_meta?: string;
  id_estado?: number;
}

export interface putInternalDataSurvyDto{
  id_grupo_meta: number;
  objetivo: string;
  identificador: string;
}

export interface putGeneralInfoSurvyDto{
  titulo: string;
  descripcion: string;
}
