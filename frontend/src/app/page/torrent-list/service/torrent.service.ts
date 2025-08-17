import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  constructor(private common: CommonService) {}

  async pushTorrent(
    keywords: string,
    movieLink: string,
    downloadLink: string,
    savePath: string,
    tags: string = ''
  ): Promise<any> {
    const url = `${this.common.apiUrl}/downloader/add_torrent_url`;

    const params = new URLSearchParams();
    params.set('keywords', keywords);
    params.set('movie_link', movieLink);
    params.set('download_link', downloadLink);
    params.set('save_path', savePath);
    if (tags) {
      params.set('tags', tags);
    }

    const fullUrl = `${url}?${params.toString()}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.common.logout();
        }
        throw new Error('Failed to push torrent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to push torrent');
    }
  }
}
