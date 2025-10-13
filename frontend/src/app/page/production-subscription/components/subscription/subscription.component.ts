import { ProductionSubscriptionService } from '../../service/production-subscription.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { KeywordFeed } from '../../models/production-subscription.interface';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MovieCardComponent } from '../../../../shared/movie-card/movie-card.component';
@Component({
  selector: 'app-production-subscription-list',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatMenuModule,MatTooltip,MovieCardComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css',
})
export class ProductionSubscriptionListComponent implements OnInit {
  keywordFeeds: KeywordFeed[] = [];

  constructor(
    private router: Router,
    private ProductionSubscriptionService: ProductionSubscriptionService
  ) {}

  ngOnInit(): void {
    this.ProductionSubscriptionService.getKeywordFeeds().subscribe({
      next: (data: KeywordFeed[]) => {
        this.keywordFeeds = data;
      },
      error: (error) => {
        console.error('Error fetching keywords feed list', error);
      },
    });
  }

  onUnsubscribeClick(event: MouseEvent, movie: KeywordFeed): void {
    event.stopPropagation();

    this.ProductionSubscriptionService.removeKeywordsRSS(
      movie.keyword
    ).subscribe({
      next: () => {
        this.ProductionSubscriptionService.getKeywordFeeds().subscribe({
          next: (data: KeywordFeed[]) => {
            this.keywordFeeds = data;
          },
          error: (error) => {
            console.error('Error fetching keywords feed list', error);
          },
        });
      },
      error: (error) => {
        console.error('Failed to remove RSS feed:', error);
      },
    });
  }

  async onMovieCardClick(movie: KeywordFeed): Promise<void> {
    try {
      this.router.navigate(['production', movie.link]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }
}
