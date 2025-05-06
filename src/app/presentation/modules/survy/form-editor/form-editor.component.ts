import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';
import { ButtonComponent } from "../../../components/button/button.component";
import { PanelComponent } from "../../../components/panel/panel.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { TextareaComponent } from "../../../components/inputs/textarea/textarea.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { AutosizeDirective } from "../../../../directives/autosize.directive";

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [
    RouterModule,
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
  // Datos internos
  internalData = {
    targetGroup: '',
    goal: '',
    identifier: ''
  };

  // Información general
  generalInfo = {
    title: '',
    description: ''
  };

  // Opciones para el tipo de pregunta
  questionTypes = [
    { label: 'Selección múltiple', value: 'multiple' },
    { label: 'Selección única', value: 'single' },
    { label: 'Falso / Verdadero', value: 'truefalse' },
    { label: 'Escala numérica', value: 'numeric' },
    { label: 'Escala / Escala Likert', value: 'likert' },
    { label: 'Ordenamiento', value: 'order' }
  ];

  // Tipo de pregunta seleccionada al agregar una nueva
  newQuestionType: string = 'multiple';

  // Lista de preguntas
  questions: any[] = [];

  addQuestion() {
    const newQuestion = {
      shortQuestion: '',
      type: this.newQuestionType,
      options: this.newQuestionType === 'multiple' || this.newQuestionType === 'single' || this.newQuestionType === 'likert' || this.newQuestionType === 'order' ? ['Opción inicial'] : [],
      rangeFrom: 1,
      rangeTo: 5,
      rangeValue: 1
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
    let questionToDuplicate = { ...this.questions[index] };
    this.questions.splice(index + 1, 0, questionToDuplicate);
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  onTypeChange(index: number) {
    const question = this.questions[index];
    console.log('Cambiando tipo de pregunta a:', question.type);
    // Reiniciar opciones si el tipo cambia
    question.options = question.type === 'multiple' || question.type === 'likert' || question.type === 'order' ? ['Opción 1'] : [];
    question.rangeFrom = 1;
    question.rangeTo = 5;
    question.rangeValue = 1;
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log('Arrastrando:', event.previousIndex, 'a', event.currentIndex);
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  saveInternalData() {
    console.log('Datos internos guardados:', this.internalData);
  }

  saveGeneralInfo() {
    console.log('Información general guardada:', this.generalInfo);
  }

  saveForm() {
    console.log('Formulario guardado:', this.questions);
  }

  // Funciones trackBy para mejorar el rendimiento de *ngFor
  trackByQuestion(index: number, question: any): number {
    return index;
  }

  trackByOption(index: number, option: any): number {
    return index;
  }
}