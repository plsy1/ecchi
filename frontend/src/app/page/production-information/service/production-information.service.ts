import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class ProductionInformationService {
  constructor(private common: CommonService) {}

  async singleMovieInformation(movie_url: string): Promise<any> {
    const url = `${this.common.apiUrl}/avbase/movie/information?url=${movie_url}`;

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

  async addKeywordsRSS(
    keyword: string,
    img: string,
    link: string
  ): Promise<any> {
    const url = `${this.common.apiUrl}/feed/addKeywords`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          keyword: keyword,
          img: img,
          link: link,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error adding RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while adding RSS feed:', error);
      throw error;
    }
  }
}
