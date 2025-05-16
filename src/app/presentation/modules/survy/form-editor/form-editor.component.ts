import { Component, inject, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';
import { ButtonComponent } from "../../../components/button/button.component";
import { PanelComponent } from "../../../components/panel/panel.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { TextareaComponent } from "../../../components/inputs/textarea/textarea.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  internalDataForm!: FormGroup;
  generalInfoForm!: FormGroup;

  newQuestionType: string = '';
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
      const idForm: number = params['formId'];
      this.survyService.getSurveyById(idForm).then(

      ).catch(() => {
        this.router.navigate(['dashboard/survy/my-surveys']);
      });
      this.targetService.getTargetGroup({ paginate: false }).then((response: any) => {
        this.targetGroups.set(response.data);
      });
      this.survyService.getInternalDataSurvey(idForm).then((response: any) => {
        if (response.success) {
          this.internalDataForm.patchValue({
            id_grupo_meta: response.data.id_grupo_meta,
            objetivo: response.data.objetivo,
            codigo: response.data.codigo
          });
        }
      });
      this.survyService.getGeneralInfoSurvey(idForm).then((response: any) => {
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
          this.newQuestionType = response.data[2].codigo;
        }
      });
    });
  }

  getInternalDataField(key: string): FormControl<any> {
    return this.internalDataForm.get(key) as FormControl<any>;
  }
  getGeneralInfoField(key: string): FormControl<any> {
    return this.generalInfoForm.get(key) as FormControl<any>;
  }

  //
  // Metodo para guardar preguntas de la encuesta
  //
  addQuestion() {
    const newQuestion = {
      shortQuestion: '',
      type: this.newQuestionType,
      options:
        this.newQuestionType === 'multiple_choice' ||
        this.newQuestionType === 'single_choice' ||
        this.newQuestionType === 'ranking' ?
        ['Opción inicial'] :
        this.newQuestionType === 'escale_likert' ?
        [
          'Totalmente en desacuerdo',
          'En desacuerdo',
          'Neutral',
          'De acuerdo',
          'Totalmente de acuerdo'
        ] : [],
      rangeFrom: 1,
      rangeTo: 5,
      rangeValue: 1,
      answer: '',
    };
    this.questions.push(newQuestion);
  }

  addOption(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.push(`Opción nueva`);
  }

  addOtherOption(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.push('Otros');
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    question.options.splice(optionIndex, 1);
  }

  duplicateQuestion(index: number) {
    let questionToDuplicate = structuredClone(this.questions[index]);
    this.questions.splice(index + 1, 0, questionToDuplicate);
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  // Funciones trackBy para mejorar el rendimiento de *ngFor
  trackByQuestion(index: number, question: any): number {
    return index;
  }

  trackByOption(index: number, option: any): number {
    return index;
  }

  // Función para generar etiquetas del rango
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


  //
  // Métodos para guardar datos
  //

  saveInternalData() {
    this.internalDataForm.markAllAsTouched();
    if (this.internalDataForm.invalid) return;
    console.log('Datos internos guardados:', this.internalDataForm.value);
  }

  saveGeneralInfo() {
    this.generalInfoForm.markAllAsTouched();
    if (this.generalInfoForm.invalid) return;
    console.log('Información general guardada:', this.generalInfoForm.value);
  }

  saveForm() {
    console.log('Formulario guardado:', this.questions);
  }
}
