import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { DownloadingTorrent } from '../models/torrent.interface';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(private common: CommonService, private http: HttpClient) {}

  getDownloadingTorrents(): Observable<DownloadingTorrent[]> {
    const url = `${this.common.apiUrl}/downloader/get_downloading_torrents`;
    const accessToken = localStorage.getItem('access_token') ?? '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post<DownloadingTorrent[]>(url, {}, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Request Failed', error);
        return throwError(() => new Error('Request Failed'));
      })
    );
  }

  deleteTorrent(
    torrentHash: string,
    deleteFiles: boolean = true
  ): Observable<any> {
    const url = `${this.common.apiUrl}/downloader/delete_torrent`;

    const accessToken = localStorage.getItem('access_token') ?? '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .post<any>(
        url,
        {
          torrent_hash: torrentHash,
          delete_files: deleteFiles,
        },
        { headers }
      )
      .pipe(
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
