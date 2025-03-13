import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sub',
  standalone: true,
  templateUrl: './movies-search-results.component.html',
  styleUrls: ['./movies-search-results.component.css'],
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
})
export class SubComponent implements OnInit {
  discoverResults: any[] = [];
  isLoading: boolean = false;
  searchKeyWords: string = '';

  constructor(public homeService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.homeService.discoverResults$.subscribe((results) => {
      this.discoverResults = results;
    });
    this.homeService.discoverByKeywordsResults$.subscribe((keyword) => {
      this.searchKeyWords = keyword;
    });
  }

  loadDiscoverData(
    filter_value: string,
    video_type: string,
    page: number
  ): void {
    if (this.isLoading == true) return;
    this.isLoading = true;
    if (this.homeService.discoverType === 1) {
      this.homeService
        .discoverByKeywords(filter_value, page)
        .then((data) => {
          this.discoverResults = data.movies;
          this.isLoading = false;
        })
        .catch((error) => {});
    } else if (this.homeService.discoverType === 2) {
      this.homeService
        .discoverByActress(filter_value, page)
        .then((data) => {
          this.discoverResults = data.movies;
          this.isLoading = false;
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
    if (this.homeService.currentPage > 1) {
      this.homeService.currentPage -= 1;
      this.loadDiscoverData(
        this.searchKeyWords,
        'normal',
        this.homeService.currentPage
      );
    }
  }

  loadNextPage(): void {
    this.homeService.currentPage += 1;
    this.loadDiscoverData(
      this.searchKeyWords,
      'normal',
      this.homeService.currentPage
    );
  }
}
