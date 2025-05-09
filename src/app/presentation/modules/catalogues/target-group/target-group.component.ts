import { Component } from '@angular/core';
import { ButtonComponent } from "../../../components/button/button.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-target-group',
  standalone: true,
  imports: [ RouterLink,ButtonComponent],
  templateUrl: './target-group.component.html',
})
export default class TargetGroupComponent { }
