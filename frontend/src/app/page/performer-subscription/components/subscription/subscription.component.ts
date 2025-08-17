import { Component } from '@angular/core';
import { PerformerSubscriptionService } from '../../service/performer-subscription.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface performerList {
  title: string;
  created_at: string;
  url: string;
  id: number;
  description: string;
}

@Component({
  selector: 'app-performer-subscription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css',
})
export class PerformerSubscriptionListComponent {
  ActressList: performerList[] = [];
  constructor(
    private PerformerSubscriptionService: PerformerSubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.PerformerSubscriptionService.getActressFeed()
      .then((data: performerList[]) => {
        this.ActressList = data;
      })
      .catch((error) => {
        console.error('Error fetching actress feeds:', error);
      });
  }

  async onClick(name: string) {
    try {
      this.router.navigate(['/performer', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async onUnsubscribeClick(event: MouseEvent, movie: any) {
    event.stopPropagation();
    try {
      await this.PerformerSubscriptionService.removeFeedsRSS(movie.url);

      const data: performerList[] =
        await this.PerformerSubscriptionService.getActressFeed();
      this.ActressList = [...data];
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  contextActress: any;

  openMenu(event: Event, actress: any) {
    event.stopPropagation();
    this.contextActress = actress;
  }
}
