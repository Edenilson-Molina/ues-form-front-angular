// survey-response.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { ButtonComponent } from '../../../components/button/button.component';
import { PanelComponent } from '../../../components/panel/panel.component';
import { FloatInputTextComponent } from '../../../components/inputs/float-input-text/float-input-text.component';
import { DatePickerComponent } from '../../../components/inputs/date-picker/date-picker.component';
import { SurvyService } from '@app/services/survy.service';
import { sendNotification, ToastType } from '@adapters/sonner-adapter';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-survey-response',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    SliderModule,
    TagModule,
    RadioButtonModule,
    ButtonComponent,
    PanelComponent,
    FloatInputTextComponent,
    DatePickerComponent
  ],
  templateUrl: './survy-view-page.component.html',
  styleUrls: ['./survy-view-page.component.css'],
})
export default class SurveyViewPageComponent implements OnInit {
  survey = signal<any>(null);
  form: FormGroup;
  surveyForm: FormGroup;
  otherResponses: { [key: number]: string } = {}; // Para respuestas de "Otros" (openAnswer)

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private survyService: SurvyService) {
    // Formulario de datos personales
    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });

    // Formulario de respuestas
    this.surveyForm = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const surveyId = this.route.snapshot.paramMap.get('codigo');
    if (surveyId) {
      this.loadSurvey(surveyId);
    }
  }

  loadSurvey(surveyId: string): void {
    this.survyService.showSurvey(surveyId).then((response: any) => {
      if (response.success) {
        this.survey.set(response.data);
        this.initializeAnswersForm();
      } else {
        sendNotification({
          type: 'error',
          summary: 'Error',
          message: 'No se pudo cargar la encuesta',
          description: response.message
        });
      }
    }).catch((error) => {
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'Error al cargar la encuesta',
        description: error.message
      });
    });
  }

  initializeAnswersForm(): void {
    const answers = this.survey().formulario.map((question: any) =>
      this.fb.control(
        question.type === 'multiple_choice' || question.type === 'ranking' ? [] : null,
        question.required ? Validators.required : []
      )
    );
    this.surveyForm.setControl('answers', this.fb.array(answers));
  }

  get answers(): FormArray {
    return this.surveyForm.get('answers') as FormArray;
  }

  getFormField(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  getAnswerControl(index: number): FormControl {
    return this.answers.at(index) as FormControl;
  }

  updateMultipleChoice(index: number, optionId: string | number, event: any): void {
    const control = this.getAnswerControl(index);
    let currentValue = control.value || [];
    if (event.target.checked) {
      if (!currentValue.includes(optionId)) currentValue.push(optionId);
    } else {
      currentValue = currentValue.filter((id: string | number) => id !== optionId);
    }
    control.setValue(currentValue.length ? currentValue : null);
  }

  drop(event: CdkDragDrop<any[]>, questionId: number): void {
    const questionIndex = this.survey().formulario.findIndex((q: any) => q.idPregunta === questionId);
    const question = this.survey().formulario[questionIndex];
    moveItemInArray(question.options, event.previousIndex, event.currentIndex);
    this.getAnswerControl(questionIndex).setValue(question.options.map((opt: any) => opt.id));
  }

  saveSurvey(): void {
    this.form.markAllAsTouched();
    this.surveyForm.markAllAsTouched();

    if (this.form.invalid || this.surveyForm.invalid) {
      sendNotification({
        type: 'error',
        summary: 'Formulario incompleto',
        message: 'Por favor, completa todos los campos requeridos'
      });
      return;
    }

    const payload = {
      codigo: this.route.snapshot.paramMap.get('codigo'),
      encuestado: {
      ...this.form.value,
      fecha_nacimiento: new Date(this.form.value.fecha_nacimiento).toISOString().split('T')[0],
      },
      respuestas: this.survey().formulario.map((question: any, index: number) => {
      const answerValue = this.getAnswerControl(index).value;
      const respuesta: any = { idPregunta: question.idPregunta };

      // Short/Long text
      if ((question.type === 'short_text' || question.type === 'long_text') && answerValue) {
        respuesta.answer = answerValue;
      }

      // Options (multiple, single, likert, true/false, ranking)
      if (
        ['multiple_choice', 'single_choice', 'likert_scale', 'true_false', 'ranking'].includes(question.type)
      ) {
        const options = (Array.isArray(answerValue) ? answerValue : [answerValue])
        .filter(v => v !== 'other' && v != null);
        if (options.length) {
        respuesta.options = options;
        }
      }

      // openAnswer (otros)
      if (this.otherResponses[question.idPregunta]) {
        respuesta.openAnswer = this.otherResponses[question.idPregunta];
      }

      // rangeValue (numeric_scale)
      if (question.type === 'numeric_scale' && answerValue != null) {
        respuesta.rangeValue = answerValue;
      }

      return respuesta;
      })
    };

    this.survyService.answerSurvey(payload).then((response: any) => {
      if (response.success) {
        sendNotification({
          type: 'success',
          summary: 'Respuestas guardadas',
          message: 'Gracias por completar la encuesta'
        });
      }
    }).catch((error) => {
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'No se pudieron guardar las respuestas',
        description: error.message
      });
    });
  }

  trackByQuestion(index: number, question: any): number {
    return question.idPregunta;
  }

  trackByOption(index: number, option: any): number {
    return option.id;
  }
}
