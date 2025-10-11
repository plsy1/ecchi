import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../../../common.service';
import { KeywordFeed } from '../models/production-subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductionSubscriptionService {
  constructor(private http: HttpClient, private common: CommonService) {}

  getKeywordFeeds(): Observable<KeywordFeed[]> {
    const url = `${this.common.apiUrl}/feed/getKeywordsFeedList`;
    const accessToken = localStorage.getItem('access_token') ?? '';

    return this.http
      .get<KeywordFeed[]>(url, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        }),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.common.logout();
          }
          console.error('Error fetching keyword feeds:', error);
          return throwError(() => error);
        })
      );
  }

  getDownloadedKeywordsFeedListGet(): Observable<KeywordFeed[]> {
    const url = `${this.common.apiUrl}/feed/getDownloadedKeywordsFeedList`;
    const accessToken = localStorage.getItem('access_token') ?? '';
    
    return this.http.get<KeywordFeed[]>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Error fetching keyword feeds:', error);
        return throwError(() => error);
      })
    );
  }

  removeKeywordsRSS(keyword: string): Observable<any> {
    const url = `${this.common.apiUrl}/feed/delKeywords`;
    const body = new HttpParams().set('keyword', keyword);

    const accessToken = localStorage.getItem('access_token') ?? '';

    return this.http
      .delete(url, {
        body,
        headers: new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error removing RSS feed:', error);
          if (error.status === 401) {
            this.common.logout();
          }
          return throwError(() => error);
        })
      );
  }
}
