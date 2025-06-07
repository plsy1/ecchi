import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movieinformation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './movie-information.component.html',
  styleUrls: ['./movie-information.component.css'],
})
export class MovieinformationComponent implements OnInit {
  movieData: any;
  movieLink: string = '';
  movieId: string = '';
  isLoading: boolean = false;

  constructor(
    private getRoute: ActivatedRoute,
    private homeService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getRoute.paramMap.subscribe((params) => {
      this.movieLink = params.get('link') || '';
      this.movieId = params.get('id') || '';
      this.loadMovieData(this.movieLink);
    });
  }

  loadMovieData(movieUrl: string): void {
    this.isLoading = true;
    this.homeService
      .singleMovieInformation(encodeURIComponent(movieUrl))
      .then((data) => {
        this.movieData = data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('加载电影信息失败', error);
        this.isLoading = false;
      });
  }

  async downloadMovie(): Promise<void> {
    try {
      const results = await this.homeService.search(this.movieId);
      this.router.navigate(['/']);
      this.homeService.movieLink = this.movieLink;
      this.homeService.queryKeywords = this.movieId;
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async subscribeToMovie(): Promise<void> {
    try {
      console.log(this.movieData.cover_image);
      const results = await this.homeService.addKeywordsRSS(
        this.movieId,
        this.movieData.cover_image,
        this.movieLink
      );
      if (results) {
        this.snackBar.open('Added successfully.', 'Close', { duration: 2000 });
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async searchByActressName(name: string) {
    try {
      this.router.navigate(['/actress', name]);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
}
