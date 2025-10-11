import { CommonService } from '../../../common.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PerformerService {
  constructor(private common: CommonService, private http: HttpClient) {}

  performerInformation: any;
  productionInformation: any;

  name: string = '';
  searchKeyWords: string = '';
  page: number = 1;
  actressNumberFilter: string = '0';

  savePerformerInformation(data: any) {
    this.performerInformation = data;
  }

  saveProductionInformation(data: any) {
    this.productionInformation = data;
  }

  saveName(name: string) {
    this.name = name;
  }

  savePage(page: number) {
    this.page = page;
  }

  saveSearchKeyWords(searchKeyWords: string) {
    this.searchKeyWords = searchKeyWords;
  }

  saveActressNumberFilter(actressNumberFilter: string) {
    this.actressNumberFilter = actressNumberFilter;
  }

  discoverByActress(filter_value: string, page: number): Observable<any> {
    const url = `${this.common.apiUrl}/avbase/actress/movies`;
    const accessToken = localStorage.getItem('access_token') ?? '';
    const params = new HttpParams()
      .set('name', filter_value)
      .set('page', page.toString());
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );

    return this.http.get<any>(url, { headers, params }).pipe(
      catchError((err) => {
        if (err.status === 401) this.common.logout();
        console.error('请求失败:', err);
        return throwError(() => new Error('请求失败，请稍后再试'));
      })
    );
  }

  addActressCollect(url: string, title: string): Observable<any> {
    const addFeedsUrl = `${this.common.apiUrl}/feed/addActressCollect`;
    const body = new HttpParams().set('avatar_url', url).set('name', title);

    const accessToken = localStorage.getItem('access_token') ?? '';

    return this.http
      .post<any>(addFeedsUrl, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ).set('Authorization', `Bearer ${accessToken}`),
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) this.common.logout();
          console.error('Error occurred while adding actress collect:', err);
          return throwError(() => err);
        })
      );
  }

  addFeedsRSS(
    url: string,
    title: string,
    description: string = ''
  ): Observable<any> {
    const addFeedsUrl = `${this.common.apiUrl}/feed/addFeeds`;
    const body = new HttpParams()
      .set('url', url)
      .set('title', title)
      .set('description', description);

    const accessToken = localStorage.getItem('access_token') ?? '';
    return this.http
      .post<any>(addFeedsUrl, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${accessToken}`),
      })
      .pipe(
        catchError((err) => {
          if (err.status === 401) this.common.logout();
          console.error('Error occurred while adding RSS feed:', err);
          return throwError(() => err);
        })
      );
  }

  getActressInformation(name: string): Observable<any> {
    const url = `${this.common.apiUrl}/avbase/actress/information`;
    const accessToken = localStorage.getItem('access_token') ?? '';
    const params = new HttpParams().set('name', name);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );

    return this.http.get<any>(url, { headers, params }).pipe(
      catchError((err) => {
        if (err.status === 401) this.common.logout();
        console.error('请求失败:', err);
        return throwError(() => new Error('请求失败，请稍后再试'));
      })
    );
  }
}
