import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import { Observable } from 'rxjs';
import { DownloadingTorrent } from '../models/torrent.interface';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(private common: CommonService) {}

  getDownloadingTorrents(): Observable<DownloadingTorrent[]> {
    return this.common.request<DownloadingTorrent[]>(
      'GET',
      'downloader/get_downloading_torrents'
    );
  }

  deleteTorrent(
    torrentHash: string,
    deleteFiles: boolean = true
  ): Observable<any> {
    return this.common.request<any>('POST', 'downloader/delete_torrent', {
      body: {
        torrent_hash: torrentHash,
        delete_files: deleteFiles,
      },
    });
  }
}
