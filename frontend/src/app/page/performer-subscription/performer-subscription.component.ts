import { Component } from '@angular/core';
import { PerformerSubscriptionListComponent } from "./components/subscription/subscription.component";
import { PerformerCollectionListComponent } from './components/collect/collect.component';

@Component({
  selector: 'app-performer-subscription',
  standalone: true,
  imports: [PerformerSubscriptionListComponent, PerformerCollectionListComponent],
  templateUrl: './performer-subscription.component.html',
  styleUrl: './performer-subscription.component.css'
})
export class PerformerSubscriptionComponent {

}
