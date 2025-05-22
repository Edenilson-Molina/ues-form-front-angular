import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';

import { ButtonComponent } from "../../../components/button/button.component";
import { PanelComponent } from "../../../components/panel/panel.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { TextareaComponent } from "../../../components/inputs/textarea/textarea.component";
import { sendNotification, ToastType } from '@adapters/sonner-adapter';
import { AutosizeDirective } from "../../../../directives/autosize.directive";
import { SurvyService } from '@app/services/survy.service';
import { TargetGroupService } from '@app/services/catalogues/target-group.service';
import { TargetGroupDto } from '@app/interfaces/responses/target-group.dto';
import { CategoryQuestionService } from '@app/services/category-question.service';
import { CategoryQuestion } from '@app/interfaces/request/category-question';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule,
    SliderModule,
    TagModule,
    DragDropModule,
    FormsModule,
    CommonModule,
    ButtonComponent,
    PanelComponent,
    FloatInputTextComponent,
    SelectComponent,
    TextareaComponent,
    AutosizeDirective
  ],
  templateUrl: './form-editor.component.html',
  styleUrl: './form-editor.component.css',
})
export default class FormEditorComponent {
  // Inyección de servicios
  private survyService = inject(SurvyService);
  private targetService = inject(TargetGroupService);
  private cagetoryQuestionService = inject(CategoryQuestionService);
  private router: Router = inject(Router);

  // Listas de grupos meta y tipos de preguntas
  targetGroups = signal<TargetGroupDto[]>([]);
  questionTypes = signal<CategoryQuestion[]>([]);

  // Banderas
  isSeeAnswer: boolean = false;

  // FormGroups para datos internos y generales
  idForm!: number;
  internalDataForm!: FormGroup;
  generalInfoForm!: FormGroup;

  newQuestionType: CategoryQuestion = {} as CategoryQuestion;
  questions: any[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    // Formulario de datos internos
    this.internalDataForm = this.fb.group({
      id_grupo_meta: [null, Validators.required],
      objetivo: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.minLength(3)]]
    });
    // Formulario de información general
    this.generalInfoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.route.params.subscribe((params) => {
      this.idForm = params['formId'];
      this.survyService.getSurveyById(this.idForm).then(
        (response: any) => {
          this.questions = response.data.formulario.map((q: any) => {
            if (q.type === 'numeric_scale' && q.rangeFrom && q.rangeTo) {
              q.rangeFrom = new FormControl(q.rangeFrom, [Validators.required]);
              q.rangeTo = new FormControl(q.rangeTo, [Validators.required]);
            }
            return q;
          });
        }
      ).catch(() => {
        this.router.navigate(['dashboard/survy/my-surveys']);
      });
      this.targetService.getTargetGroup({ paginate: false, activo: true }).then((response: any) => {
        this.targetGroups.set(response.data);
      });
      this.survyService.getInternalDataSurvey(this.idForm).then((response: any) => {
        if (response.success) {
          this.internalDataForm.patchValue({
            id_grupo_meta: response.data.id_grupo_meta,
            objetivo: response.data.objetivo,
            codigo: response.data.codigo
          });
        }
      });
      this.survyService.getGeneralInfoSurvey(this.idForm).then((response: any) => {
        if (response.success) {
          this.generalInfoForm.patchValue({
            titulo: response.data.titulo,
            descripcion: response.data.descripcion
          });
        }
      });

      this.cagetoryQuestionService.getCategoriesQuestion().then((response) => {
        if (response.success) {
          this.questionTypes.set(response.data);
          this.newQuestionType = response.data[2];
        }
      });
    });
  }

  // Métodos validadores para los formularios
  getInternalDataField(key: string): FormControl<any> {
    return this.internalDataForm.get(key) as FormControl<any>;
  }
  getGeneralInfoField(key: string): FormControl<any> {
    return this.generalInfoForm.get(key) as FormControl<any>;
  }

  // Método para agregar preguntas
  addQuestion() {
    const newQuestion = {
      shortQuestion: '',
      nombre: this.newQuestionType.nombre,
      type: this.newQuestionType.codigo,
      options:
        this.newQuestionType.codigo === 'multiple_choice' ||
        this.newQuestionType.codigo === 'single_choice' ||
        this.newQuestionType.codigo === 'ranking' ?
        ['Opción inicial'] :
        this.newQuestionType.codigo === 'likert_scale' ?
        [
          'Totalmente en desacuerdo',
          'En desacuerdo',
          'Neutral',
          'De acuerdo',
          'Totalmente de acuerdo'
        ] :
        this.newQuestionType.codigo === 'true_false' ?
        ['Verdadero', 'Falso'] : [],
      rangeFrom: new FormControl(1, [Validators.required]),
      rangeTo: new FormControl(5, [Validators.required]),
      allowOtherOption: false,
    };
    this.questions.push(newQuestion);
  }

  // Otros métodos (addOption, removeOption, etc.) permanecen iguales
  addOption(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.push(`Opción nueva`);
  }

  addOtherOption(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.allowOtherOption = true;
  }

  removeOtherOption(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.allowOtherOption = false;
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.splice(optionIndex, 1);
  }

  duplicateQuestion(index: number) {
    let questionToDuplicate = structuredClone(this.questions[index]);
    if (questionToDuplicate.type === 'numeric_scale' && questionToDuplicate.rangeFrom && questionToDuplicate.rangeTo) {
      questionToDuplicate.rangeFrom = new FormControl(questionToDuplicate.rangeFrom.value, [Validators.required]);
      questionToDuplicate.rangeTo = new FormControl(questionToDuplicate.rangeTo.value, [Validators.required]);
    }
    this.questions.splice(index + 1, 0, questionToDuplicate);
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  trackByQuestion(index: number, question: any): number {
    return index;
  }

  trackByOption(index: number, option: any): number {
    return index;
  }

  getRangeLabels(from: number, to: number): number[] {
    const labels = [];
    for (let i = from; i <= to; i++) {
      labels.push(i);
    }
    return labels;
  }

  getSafeRangeFrom(value: any): number {
    const num = Number(value);
    if (isNaN(num) || num < 1) return 1;
    if (num > 10) return 10;
    return num;
  }

  getSafeRangeTo(value: any): number {
    const num = Number(value);
    if (isNaN(num) || num < 1) return 1;
    if (num > 10) return 10;
    return num;
  }

  async saveInternalData() {
    this.internalDataForm.markAllAsTouched();
    if (this.internalDataForm.invalid) return;
    try {
      let type: ToastType = 'success';
      const response = await this.survyService.putInternalDataSurvey(this.idForm, {
        id_grupo_meta: this.internalDataForm.value.id_grupo_meta,
        objetivo: this.internalDataForm.value.objetivo,
        identificador: this.internalDataForm.value.codigo
      });
      if (response.success) {
        this.internalDataForm.patchValue({
          id_grupo_meta: response.data.id_grupo_meta,
          objetivo: response.data.objetivo,
          codigo: response.data.codigo
        });
        sendNotification({
          type: type,
          summary: 'Datos internos guardados',
          message: 'Actualizado',
          description: response.message,
        });
      }
    } catch (error) {}
  }

  async saveGeneralInfo() {
    this.generalInfoForm.markAllAsTouched();
    if (this.generalInfoForm.invalid) return;
    try {
      let type: ToastType = 'success';
      const response = await this.survyService.putGeneralInfoSurvey(this.idForm, {
        titulo: this.generalInfoForm.value.titulo,
        descripcion: this.generalInfoForm.value.descripcion
      });
      if (response.success) {
        this.generalInfoForm.patchValue({
          titulo: response.data.titulo,
          descripcion: response.data.descripcion
        });
        sendNotification({
          type: type,
          summary: 'Información general guardada',
          message: 'Actualizado',
          description: response.message,
        });
      }
    } catch (error) {}
  }

  isQuestionsValid(): boolean {
    if (this.questions.length < 1) {
      return false;
    }
    for (const q of this.questions) {
      if (!q.shortQuestion || q.shortQuestion.trim().length < 3) {
        return false;
      }
      if ((q.type === 'multiple_choice' || q.type === 'single_choice' || q.type === 'ranking' || q.type === 'likert_scale') && q.options) {
        for (const opt of q.options) {
          if (!opt || opt.trim().length < 1) {
            return false;
          }
        }
      }
      if (q.type === 'numeric_scale' && q.rangeFrom && q.rangeTo) {
        if (q.rangeFrom.value === '' || q.rangeTo.value === '') {
          return false; // Requerido
        }
        const fromNum = Number(q.rangeFrom.value);
        const toNum = Number(q.rangeTo.value);
        if (isNaN(fromNum) || isNaN(toNum) || fromNum >= toNum) {
          return false;
        }
      }
    }
    return true;
  }

  saveForm() {
    if (!this.isQuestionsValid()) {
      alert('Por favor, completa todas las preguntas, opciones y rangos válidos antes de guardar.');
      return;
    }
    try {
      let type: ToastType = 'success';
      this.survyService.putFormSurvey(this.idForm, this.questions.map(q => ({
        ...q,
        rangeFrom: q.rangeFrom.value,
        rangeTo: q.rangeTo.value
      }))).then((response: any) => {
        if (response.success) {
          sendNotification({
            type: type,
            summary: 'Formulario guardado',
            message: 'Actualizado',
            description: response.message,
          });
        }
      });
    } catch (error) {}
  }
}
