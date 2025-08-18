import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductionInformationService {
  constructor(private common: CommonService, private http: HttpClient) {}

  getSingleProductionInformation(movie_url: string): Observable<any> {
    const url = `${this.common.apiUrl}/avbase/movie/information?url=${movie_url}`;
    const accessToken = localStorage.getItem('access_token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        return throwError(
          () => new Error('Error occurred while getting information')
        );
      })
    );
  }

  addProductionSubscribe(
    keyword: string,
    img: string,
    link: string
  ): Observable<any> {
    const url = `${this.common.apiUrl}/feed/addKeywords`;
    const body = new URLSearchParams({
      keyword,
      img,
      link,
    }).toString();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error occurred while adding RSS feed:', error);
        const message =
          error.error?.detail || 'Error occurred while adding RSS feed';
        return throwError(() => new Error(message));
      })
    );
  }
}
