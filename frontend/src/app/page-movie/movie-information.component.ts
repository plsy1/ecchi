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

import { MovieStateService } from '../movie-state-service.service';



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
  movieLink: any;
  movieId: string = '';
  isLoading: boolean = false;

  constructor(
    private getRoute: ActivatedRoute,
    private homeService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private movieState: MovieStateService,
  ) {}

  ngOnInit(): void {
    this.getRoute.paramMap.subscribe((params) => {
      this.movieId = params.get('id') || '';
      this.movieData = this.movieState.getSelectedMovie();

      if (this.movieData && this.movieData.avbase_link) {
        this.movieLink = this.movieData.avbase_link;
      } else {
        this.movieLink = this.movieId;
      }

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
      const results = await this.homeService.search(this.movieData.props.pageProps.work.work_id);
      this.router.navigate(['/torrents']);
      this.homeService.movieLink = this.movieLink;
      this.homeService.queryKeywords = this.movieId;
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async subscribeToMovie(): Promise<void> {
    try {
      console.log(this.movieData.cover_image);
      const results = await this.homeService.addKeywordsRSS(
        this.movieData.props.pageProps.work.work_id,
        this.movieData.props.pageProps.work.products[0]?.image_url,
        this.movieLink
      );
      if (results) {
        this.snackBar.open('Added successfully.', 'Close', { duration: 2000 });
      }
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async searchByActressName(name: string) {
    try {
      this.router.navigate(['/actress', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  onWheelScroll(event: WheelEvent) {
  const container = event.currentTarget as HTMLElement;
  // 阻止默认纵向滚动
  event.preventDefault();
  // 将纵向滚轮 deltaY 转为横向滚动
  container.scrollLeft += event.deltaY;
}
}
