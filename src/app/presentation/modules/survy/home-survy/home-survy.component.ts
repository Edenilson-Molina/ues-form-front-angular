import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from "../../../components/button/button.component";
import { CardComponent } from "../../../components/card/card.component";

@Component({
  selector: 'app-home-survy',
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  templateUrl: './home-survy.component.html',
})
export default class HomeSurvyComponent { }
