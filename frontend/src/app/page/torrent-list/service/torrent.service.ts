import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  searchKeyWords: string = '';
  searchResults: any[] = [];

  constructor(private common: CommonService, private http: HttpClient) {}

  saveState(searchResults: any[], searchKeyWords: string) {
    this.searchKeyWords = searchKeyWords;
    this.searchResults = searchResults;
  }

  pushTorrent(
    keywords: string,
    movieId: string,
    downloadLink: string,
    savePath: string,
    performerName: string,
    tags: string = ''
  ): Observable<any> {
    const url = `${this.common.apiUrl}/downloader/add_torrent_url`;

    let params = new HttpParams()
      .set('keywords', keywords)
      .set('movie_link', movieId)
      .set('download_link', downloadLink)
      .set('save_path', savePath)
      .set('performerName', performerName);
      ;

    if (tags) {
      params = params.set('tags', tags);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(url, null, { headers, params }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Failed to push torrent:', error);
        return throwError(() => new Error('Failed to push torrent'));
      })
    );
  }

  search(
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    const url = `${this.common.apiUrl}/prowlarr/search`;

    let params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('page_size', pageSize);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    });

    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Search request failed:', error);
        return throwError(() => new Error('Request Failed'));
      }),
      map((res) => res)
    );
  }
}
