import { ApiService } from '../api.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
interface KeywordFeed {
  id: number;
  keyword: string;
  img: string;
}

@Component({
  selector: 'app-feed-movies',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './feed-movies.component.html',
  styleUrls: ['./feed-movies.component.css']
})
export class FeedMoviesComponent implements OnInit {
  keywordFeeds: KeywordFeed[] = [];

  constructor(
        private router: Router,
        private HomeService: ApiService

  ) {}

  ngOnInit() {
    this.getKeywordFeeds();
  }

  async getKeywordFeeds() {
    const url = '/api/v1/feed/getKeywordsFeedList';
    try {
      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: KeywordFeed[] = await response.json(); 
      this.keywordFeeds = data;
    } catch (error) {
      console.error('Error fetching keyword feeds:', error);
    }
  }

  async onUnsubscribeClick(event: MouseEvent,movie: any) {
    event.stopPropagation();
    try {
      this.HomeService.removeKeywordsRSS(movie.keyword);
      this.getKeywordFeeds();
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async onMovieCardClick(movie: any) {
    console.log('Movie clicked:', movie);
    try {
      this.router.navigate(['movies',movie.link,movie.keyword]);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
  
}