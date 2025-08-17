import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class PerformerService {
  constructor(private common: CommonService) {}

  performerInformation: any;
  productionInformation: any;

  name: string = '';
  searchKeyWords: string = '';
  page: number = 1;

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

  async discoverByActress(filter_value: string, page: number): Promise<any> {
    const url = `${this.common.apiUrl}/avbase/actress/movies?name=${filter_value}&page=${page}`;

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

      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async addActressCollect(url: string, title: string): Promise<any> {
    const addFeedsUrl = `${this.common.apiUrl}/feed/addActressCollect`;

    try {
      const response = await fetch(addFeedsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          avatar_url: url,
          name: title,
        }),
      });

      return response;
    } catch (error) {
      console.error('Error occurred while adding RSS feed:', error);
      throw error;
    }
  }

  async addFeedsRSS(
    url: string,
    title: string,
    description: string = ''
  ): Promise<any> {
    const addFeedsUrl = `${this.common.apiUrl}/feed/addFeeds`;

    try {
      const response = await fetch(addFeedsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
          title: title,
          description: description,
        }),
      });

      return response;
    } catch (error) {
      console.error('Error occurred while adding RSS feed:', error);
      throw error;
    }
  }

  async getActressInformation(name: string): Promise<any> {
    const url = `${this.common.apiUrl}/avbase/actress/information?name=${name}`;

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
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }
}
