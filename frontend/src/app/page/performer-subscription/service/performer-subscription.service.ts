import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class PerformerSubscriptionService {
  constructor(private common: CommonService) {}

  async getActressCollect(): Promise<any> {
    const url = `${this.common.apiUrl}/feed/getCollectList`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

  async removeActressCollect(url: string): Promise<any> {
    const urlToDelete = `${this.common.apiUrl}/feed/delActressCollect`;

    try {
      const response = await fetch(urlToDelete, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error removing RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while removing RSS feed:', error);
      throw error;
    }
  }

    async getActressFeed(): Promise<any> {
    const url = `${this.common.apiUrl}/feed/getFeedsList`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

    async removeFeedsRSS(url: string): Promise<any> {
    const urlToDelete = `${this.common.apiUrl}/feed/delFeeds`;

    try {
      const response = await fetch(urlToDelete, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error removing RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while removing RSS feed:', error);
      throw error;
    }
  }


}
