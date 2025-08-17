import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private common: CommonService) {}

  async getEmbyItemTotalCount() {
    const url = `${this.common.apiUrl}/emby/get_item_counts`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getEmbyLatestItems() {
    const url = `${this.common.apiUrl}/emby/get_latest`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getEmbyResumeItems() {
    const url = `${this.common.apiUrl}/emby/get_resume`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getEmbyViews() {
    const url = `${this.common.apiUrl}/emby/get_views`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
