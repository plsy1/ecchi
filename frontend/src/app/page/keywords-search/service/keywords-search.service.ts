import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import { keywordsSearchResponse } from '../models/keywordSearch.interface';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class KeywordsSearchService {
  public discoverResults?: keywordsSearchResponse[];
  public searchKeyWords: string = '';
  public currentPage: number = 1;
  public discoverType: number = 1;
  public actressNumberFilter: string = '0';

  public selectedMovie: any = null;

  constructor(private common: CommonService, private http: HttpClient) {}

  saveState(
    results: keywordsSearchResponse[],
    keywords: string,
    page: number,
    actressNumberFilter: string
  ) {
    this.discoverResults = results;
    this.searchKeyWords = keywords;
    this.currentPage = page;
    this.actressNumberFilter = actressNumberFilter;
  }

  saveSelectedMovie(movie: any) {
    this.selectedMovie = movie;
  }

  getSelectedMovie() {
    return this.selectedMovie;
  }

  discoverByKeywords(filter_value: string, page: number): Observable<any> {
    const url = `${this.common.apiUrl}/avbase/keywords?keywords=${filter_value}&page=${page}`;
    const accessToken = localStorage.getItem('access_token') ?? '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Request Failed', error);
        return throwError(() => new Error('Request Failed'));
      })
    );
  }

      checkMovieExists(title: string): Observable<boolean> {
      const url = `${this.common.apiUrl}/emby/exists?title=${encodeURIComponent(
        title
      )}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      });
  
      return this.http.get<boolean>(url, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.common.logout();
          }
          console.error('Request Failed', error);
          return throwError(() => new Error('Request Failed'));
        })
      );
    }

}
