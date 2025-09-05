import { Component } from '@angular/core';
import { AvbaseComponent } from "./component/avbase/avbase.component";
import { MatTabsModule } from '@angular/material/tabs';
import { FanzaComponent } from "./component/fanza/fanza.component";
import { JavtrailersComponent } from './component/javtrailers/javtrailers.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [AvbaseComponent, MatTabsModule, FanzaComponent, JavtrailersComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {

}
