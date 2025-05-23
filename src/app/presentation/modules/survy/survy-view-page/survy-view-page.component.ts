import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from "../../../components/button/button.component";
import { PanelComponent } from "../../../components/panel/panel.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { DatePickerComponent } from "../../../components/inputs/date-picker/date-picker.component";
import { SurvyService } from '@app/services/survy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { sendNotification, ToastType } from '@adapters/sonner-adapter';

@Component({
  selector: 'app-survy-view-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
    PanelComponent,
    FloatInputTextComponent,
    DatePickerComponent,
    SliderModule,
    CheckboxModule,
    RadioButtonModule,
    DragDropModule
  ],
  templateUrl: './survy-view-page.component.html',
})
export default class SurvyViewPageComponent {
  private survyService = inject(SurvyService);
  private router = inject(Router);

  form!: FormGroup;
  surveyForm!: FormGroup;
  surveyData = signal<any>(null);
  questionario = signal<any[]>([]);
  codigo = signal<string>('');

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    // Formulario para datos personales
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: [null, Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      edad: ['', [Validators.required, Validators.min(15), Validators.max(80), Validators.pattern(/^\d+$/)]],
    });

    // Formulario dinámico para las respuestas del cuestionario
    this.surveyForm = this.fb.group({
      answers: this.fb.array([])
    });

    this.route.params.subscribe(params => {
      this.codigo.set(params['codigo']);
      this.getShowSurvey(this.codigo());
    });
  }

  get answersArray(): FormArray {
    return this.surveyForm.get('answers') as FormArray;
  }

  async getShowSurvey(codigo: string) {
    try {
      const response: any = await this.survyService.showSurvey(codigo);
      if (response.success) {
        this.surveyData.set(response.data);
        this.questionario.set(response.data.formulario);
        this.loadQuestions(response.data.formulario);
      } else {
        sendNotification({
          type: 'error' as ToastType,
          summary: 'Error',
          message: 'No se pudo cargar la encuesta',
          description: response.message,
        });
        this.router.navigate(['/']);
      }
    } catch (error) {
      sendNotification({
        type: 'error' as ToastType,
        summary: 'Error',
        message: 'Error al cargar la encuesta',
      });
      this.router.navigate(['/']);
    }
  }

  loadQuestions(questions: any[]) {
    const answersArray = this.surveyForm.get('answers') as FormArray;
    answersArray.clear();

    questions.forEach((question: any, index: number) => {
      let control;
      switch (question.type) {
        case 'short_text':
        case 'long_text':
          control = this.fb.control('', Validators.required);
          break;
        case 'multiple_choice':
          control = this.fb.control([], Validators.required); // Array para selección múltiple
          break;
        case 'single_choice':
        case 'true_false':
        case 'likert_scale':
          control = this.fb.control(null, Validators.required); // Valor único
          break;
        case 'numeric_scale':
          control = this.fb.control(question.rangeFrom, [
            Validators.required,
            Validators.min(question.rangeFrom),
            Validators.max(question.rangeTo)
          ]);
          break;
        case 'ranking':
          control = this.fb.control(question.options.map((opt: any) => opt.opcion), Validators.required);
          break;
        default:
          control = this.fb.control(null);
      }
      answersArray.push(control);
    });
  }

  drop(event: CdkDragDrop<string[]>, questionIndex: number) {
    const answers = this.answersArray.at(questionIndex).value as string[];
    moveItemInArray(answers, event.previousIndex, event.currentIndex);
    this.answersArray.at(questionIndex).setValue([...answers]);
  }

  getFormField(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  getAnswerControl(index: number): FormControl {
    return this.answersArray.at(index) as FormControl;
  }

  getRangeLabels(from: number, to: number): number[] {
    const labels = [];
    for (let i = from; i <= to; i++) {
      labels.push(i);
    }
    return labels;
  }

  async saveSurvey() {
    this.form.markAllAsTouched();
    this.surveyForm.markAllAsTouched();

    console.log(this.form.value);
    console.log(this.surveyForm.value);
    
    if (this.form.invalid || this.surveyForm.invalid) {
      sendNotification({
        type: 'error' as ToastType,
        summary: 'Error',
        message: 'Por favor, completa todos los campos requeridos',
      });
      return;
    }

    const surveyResponse = {
      personalData: this.form.value,
      answers: this.questionario().map((question: any, index: number) => ({
        idPregunta: question.idPregunta,
        respuesta: this.answersArray.at(index).value
      }))
    };

    try {
      const response:any = await this.survyService.answerSurvey(this.codigo(), surveyResponse);
      if (response.success) {
        sendNotification({
          type: 'success' as ToastType,
          summary: 'Encuesta enviada',
          message: 'Gracias por responder',
          description: response.message,
        });
        this.router.navigate(['/']);
      } else {
        sendNotification({
          type: 'error' as ToastType,
          summary: 'Error',
          message: 'No se pudo enviar la encuesta',
          description: response.message,
        });
      }
    } catch (error) {
      sendNotification({
        type: 'error' as ToastType,
        summary: 'Error',
        message: 'Error al enviar la encuesta',
      });
    }
  }
}