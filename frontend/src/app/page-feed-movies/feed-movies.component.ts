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
    this.HomeService.getKeywordFeeds().then((data: KeywordFeed[]) => {
      this.keywordFeeds = data;
    }).catch(error=> {
      console.error("Error fetching keywords feed list",error);
    })
  }



  async onUnsubscribeClick(event: MouseEvent,movie: any) {
    event.stopPropagation();
    try {
      this.HomeService.removeKeywordsRSS(movie.keyword);
      this.HomeService.getKeywordFeeds().then((data: KeywordFeed[]) => {
        this.keywordFeeds = data;
      }).catch(error=> {
        console.error("Error fetching keywords feed list",error);
      })
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async onMovieCardClick(movie: any) {
    console.log('Movie clicked:', movie);
    try {
      this.router.navigate(['movies',movie.link]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }
  
}