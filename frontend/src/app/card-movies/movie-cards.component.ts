import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MovieStateService } from '../movie-state-service.service';

@Component({
  selector: 'app-movie-cards',
  standalone: true,
  templateUrl: './movie-cards.component.html',
  styleUrls: ['./movie-cards.component.css'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class MovieCards implements OnInit {
  discoverResults: any[] = [];
  isLoading: boolean = false;
  searchKeyWords: string = '';

  actressNumberFilter: string = '0';

  constructor(
    public ApiService: ApiService,
    private movieState: MovieStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchKeyWords = this.ApiService.queryKeywords;

    const cacheMatches =
      this.movieState.searchKeyWords === this.searchKeyWords &&
      this.movieState.discoverResults.length > 0;

    if (cacheMatches) {
      this.discoverResults = this.movieState.discoverResults;
      this.actressNumberFilter = this.movieState.actressNumberFilter;
    } else {
      this.loadDiscoverData(this.searchKeyWords, 'normal', 1);
    }
  }

  loadDiscoverData(
    filter_value: string,
    video_type: string,
    page: number
  ): void {
    if (this.isLoading == true) return;
    this.isLoading = true;
    if (this.ApiService.discoverType === 1) {
      this.ApiService.discoverByKeywords(filter_value, page)
        .then((data) => {
          this.discoverResults = data.movies;
          this.isLoading = false;
          this.movieState.saveState(
            this.discoverResults,
            this.searchKeyWords,
            this.ApiService.currentPage,
            this.ApiService.discoverType,
            this.actressNumberFilter
          );
        })
        .catch((error) => {});
    } else if (this.ApiService.discoverType === 2) {
      this.ApiService.discoverByActress(filter_value, page)
        .then((data) => {
          this.discoverResults = data.movies;
          this.isLoading = false;
          this.movieState.saveState(
            this.discoverResults,
            this.searchKeyWords,
            this.ApiService.currentPage,
            this.ApiService.discoverType,
            this.actressNumberFilter
          );
        })
        .catch((error) => {});
    }
  }

  onImageError(event: any): void {}

  async onMovieClick(movie: any) {
    try {
      this.router.navigate(['movies', movie.avbase_link, movie.id]);
    } catch (error) {}
  }

  loadPreviousPage(): void {
    if (this.ApiService.currentPage > 1) {
      this.ApiService.currentPage -= 1;
      this.loadDiscoverData(
        this.searchKeyWords,
        'normal',
        this.ApiService.currentPage
      );
    }
  }

  loadNextPage(): void {
    this.ApiService.currentPage += 1;
    this.loadDiscoverData(
      this.searchKeyWords,
      'normal',
      this.ApiService.currentPage
    );
  }
  shouldShowMovie(movie: any): boolean {
    if (!this.actressNumberFilter) return true;

    const actorCount = movie.actors?.length || 0;

    if (this.actressNumberFilter === '1') return actorCount === 1;
    if (this.actressNumberFilter === '2') return actorCount >= 2;

    return true;
  }

  onFilterChange(value: string) {
    this.movieState.actressNumberFilter = value;
  }
}
