import { Injectable } from '@angular/core';
import { getAxiosAdapter } from './common/axios.service';
import { RequestCategoryQuestionDto } from '@app/interfaces/request/category-question';

@Injectable({
  providedIn: 'root'
})
export class CategoryQuestionService {
  private axiosService = getAxiosAdapter()

  async getCategoriesQuestion() {
    return await this.axiosService.get<RequestCategoryQuestionDto>('/catalogo/categorias-preguntas');
  }
}
