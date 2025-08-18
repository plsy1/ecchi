import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DownloadingTorrent } from '../models/torrent.interface';



@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(private common: CommonService, private http: HttpClient) {}

  getDownloadingTorrents(): Observable<DownloadingTorrent[]> {
    const url = `${this.common.apiUrl}/downloader/get_downloading_torrents`;
    return this.http.post<DownloadingTorrent[]>(url, {});
  }

  deleteTorrent(
    torrentHash: string,
    deleteFiles: boolean = false
  ): Observable<any> {
    const url = `${this.common.apiUrl}/downloader/delete_torrent`;
    return this.http.post<any>(url, {
      torrent_hash: torrentHash,
      delete_files: deleteFiles,
    });
  }
}
