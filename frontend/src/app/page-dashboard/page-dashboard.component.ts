import { Component } from '@angular/core';
import { CardEmbyTotalCountComponent } from '../card-emby-total-count/card-emby-total-count.component';
import { CardEmbyLatestItemsComponent } from '../card-emby-latest-items/card-emby-latest-items.component';
import { CardEmbyResumeItemsComponent } from '../card-emby-resume-items/card-emby-resume-items.component';
import { CardEmbyViewsComponent } from '../card-emby-views/card-emby-views.component';

@Component({
  selector: 'app-page-dashboard',
  standalone: true,
  imports: [CardEmbyTotalCountComponent, CardEmbyLatestItemsComponent, CardEmbyResumeItemsComponent, CardEmbyViewsComponent],
  templateUrl: './page-dashboard.component.html',
  styleUrl: './page-dashboard.component.css'
})
export class PageDashboardComponent {

}
