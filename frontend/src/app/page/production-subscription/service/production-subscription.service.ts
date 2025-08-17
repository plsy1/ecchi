import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import { KeywordFeed } from '../models/production-subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductionSubscriptionService {
  constructor(private common: CommonService) {}

  async getKeywordFeeds() {
    const url = `${this.common.apiUrl}/feed/getKeywordsFeedList`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: KeywordFeed[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keyword feeds:', error);
      throw error;
    }
  }

  async removeKeywordsRSS(keyword: string): Promise<any> {
    const url = `${this.common.apiUrl}/feed/delKeywords`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          keyword: keyword,
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
