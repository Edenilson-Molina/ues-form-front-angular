import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonComponent } from "../../../components/button/button.component";
import { PanelComponent } from "../../../components/panel/panel.component";
import { FloatInputTextComponent } from "../../../components/inputs/float-input-text/float-input-text.component";
import { SelectComponent } from "../../../components/inputs/select/select.component";
import { TextareaComponent } from "../../../components/inputs/textarea/textarea.component";

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [
    ButtonComponent,
    PanelComponent,
    FloatInputTextComponent,
    SelectComponent,
    TextareaComponent,
    DividerModule
  ],
  templateUrl: './form-editor.component.html',
})
export default class FormEditorComponent { }
