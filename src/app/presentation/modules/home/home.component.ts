import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, ColorPickerModule, FormsModule, DatePickerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  color: any
  date: any

  click(){
    toast('Hello World')
  }
}
