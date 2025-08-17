import { Component } from '@angular/core';
import { ActressInformationComponent } from "./components/performer-detials-card/performer-detials-card.component";
import { MovieCards } from "./components/production-card/production-cards.component";

@Component({
  selector: 'app-performer-information',
  standalone: true,
  imports: [ActressInformationComponent, MovieCards],
  templateUrl: './performer-information.component.html',
  styleUrl: './performer-information.component.css'
})
export class PerformerInformationComponent {

}
