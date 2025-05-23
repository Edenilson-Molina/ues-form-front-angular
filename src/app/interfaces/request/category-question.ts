export interface RequestCategoryQuestionDto {
  success: boolean;
  message: string;
  data:    CategoryQuestion[];
}

export interface CategoryQuestion {
  id:                  number;
  codigo:              string;
  nombre:              string;
  descripcion:         string;
  max_text_length:     number;
  max_seleccion_items: number;
  es_escala_numerica:  boolean;
  es_booleano:         boolean;
  permite_otros:       boolean;
  id_clase_pregunta:   number;
  clase_pregunta:      string;
  requiere_lista:      boolean;
  id_tipo_pregunta:    number;
  tipo_pregunta:       string;
  allowOtherOption?: boolean;
}
