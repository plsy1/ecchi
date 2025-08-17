import { ProductionSubscriptionService } from './service/production-subscription.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { KeywordFeed } from './models/production-subscription.interface';

@Component({
  selector: 'app-production-subscription',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './production-subscription.component.html',
  styleUrl: './production-subscription.component.css',
})
export class ProductionSubscriptionComponent implements OnInit {
  keywordFeeds: KeywordFeed[] = [];

  constructor(
    private router: Router,
    private ProductionSubscriptionService: ProductionSubscriptionService
  ) {}

  ngOnInit() {
    this.ProductionSubscriptionService.getKeywordFeeds()
      .then((data: KeywordFeed[]) => {
        this.keywordFeeds = data;
      })
      .catch((error) => {
        console.error('Error fetching keywords feed list', error);
      });
  }

  async onUnsubscribeClick(event: MouseEvent, movie: any) {
    event.stopPropagation();
    try {
      await this.ProductionSubscriptionService.removeKeywordsRSS(movie.keyword);

      const data: KeywordFeed[] =
        await this.ProductionSubscriptionService.getKeywordFeeds();
      this.keywordFeeds = data;
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async onMovieCardClick(movie: any) {
    try {
      this.router.navigate(['production', movie.link]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }
}
