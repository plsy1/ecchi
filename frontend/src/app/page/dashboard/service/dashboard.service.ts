import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private common: CommonService) {}

  getEmbyItemTotalCount(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_item_counts`;

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

  getEmbyLatestItems(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_latest`;
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

  getEmbyResumeItems(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_resume`;
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

  getEmbyViews(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_views`;
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
}
