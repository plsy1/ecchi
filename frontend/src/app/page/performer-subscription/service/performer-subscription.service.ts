import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class PerformerSubscriptionService {
  constructor(private http: HttpClient, private common: CommonService) {}

  getActressCollect(): Observable<any> {
    const url = `${this.common.apiUrl}/feed/getCollectList`;
    const accessToken = localStorage.getItem('access_token') ?? '';
    
    return this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Failed to fetch actress collect list:', error);
        return throwError(() => error);
      })
    );
  }

  removeActressCollect(urlParam: string): Observable<any> {
    const url = `${this.common.apiUrl}/feed/delActressCollect`;
    const accessToken = localStorage.getItem('access_token') ?? '';
    const body = new HttpParams().set('url', urlParam);

    return this.http.delete(url, { body, headers: new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }) }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Failed to remove actress collect:', error);
        return throwError(() => error);
      })
    );
  }

  getActressFeed(): Observable<any> {
    const url = `${this.common.apiUrl}/feed/getFeedsList`;
    const accessToken = localStorage.getItem('access_token') ?? '';
    
    return this.http.get(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Failed to fetch RSS feeds:', error);
        return throwError(() => error);
      })
    );
  }

  removeFeedsRSS(urlParam: string): Observable<any> {
    const url = `${this.common.apiUrl}/feed/delFeeds`;
    const body = new HttpParams().set('url', urlParam);

    const accessToken = localStorage.getItem('access_token') ?? '';

    return this.http.delete(url, { body, headers: new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }) }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Failed to remove RSS feed:', error);
        return throwError(() => error);
      })
    );
  }
}
