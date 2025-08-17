import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private _isSidebarOpen = true;

  constructor(private common: CommonService) {}

  get isSidebarOpen() {
    return this._isSidebarOpen;
  }

  setSidebarOpen(state: boolean) {
    this._isSidebarOpen = state;
  }


  set isSidebarOpen(state: boolean) {
    this._isSidebarOpen = state;
  }

  async search(
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    const url = `${this.common.apiUrl}/prowlarr/search?query=${query}&page=${page}&page_size=${pageSize}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.common.logout();
        }
        throw new Error('请求失败');
      }

      const data = await response.json();
      this.common.torrentSearchResultsSubject.next(data);
     
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }
}
