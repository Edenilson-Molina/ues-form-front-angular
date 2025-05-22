import { Component } from '@angular/core';
import { ButtonComponent } from "../../../components/button/button.component";
import { PanelComponent } from "../../../components/panel/panel.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-survy-view-page',
  imports: [ButtonComponent, PanelComponent, FloatInputTextComponent],
  templateUrl: './survy-view-page.component.html',
})
export default class SurvyViewPageComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      edad: ['', [Validators.required, Validators.min(15), Validators.max(80)]],
    });
  }
}
