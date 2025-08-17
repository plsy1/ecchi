import { Injectable } from '@angular/core';
import {
  RankingTypeOfWorks,
  ActressRanking,
  RankingItem,
} from '../models/page-explore';
import { CommonService } from '../../../common.service';
@Injectable({
  providedIn: 'root',
})
export class PageExploreServiceService {
  private actressRankingCache: ActressRanking[] = [];
  private lastFetchedPage: number = 1;

  private workRankingCache: RankingItem[] = [];
  private lastFetchedWorkPage: number = 1;
  private workRankingType: RankingTypeOfWorks = RankingTypeOfWorks.Weekly;

  constructor(private common: CommonService) {}

  setRankingData(data: ActressRanking[], page: number): void {
    this.actressRankingCache = data;
    this.lastFetchedPage = page;
  }

  getRankingData(): ActressRanking[] {
    return this.actressRankingCache;
  }

  getLastPage(): number {
    return this.lastFetchedPage;
  }

  getWorkRankingType(): RankingTypeOfWorks {
    return this.workRankingType;
  }

  async fetchActressRanking(page: number): Promise<ActressRanking[]> {
    const url = `${this.common.apiUrl}/fanza/monthlyactress?page=${page}`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: ActressRanking[]) => {
        return data;
      });
  }

  setWorkRankingData(
    data: RankingItem[],
    page: number,
    RankingType: RankingTypeOfWorks
  ): void {
    this.workRankingCache = data;
    this.lastFetchedWorkPage = page;
    this.workRankingType = RankingType;
  }

  getWorkRankingData(): RankingItem[] {
    return this.workRankingCache;
  }

  getLastWorkPage(): number {
    return this.lastFetchedWorkPage;
  }

  async fetchWorkRanking(
    page: number,
    term: RankingTypeOfWorks
  ): Promise<RankingItem[]> {
    const url = `${this.common.apiUrl}/fanza/monthlyworks?page=${page}&term=${term}`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: RankingItem[]) => {
        return data;
      });
  }

  async getAvbaseIndex() {
    const url = `${this.common.apiUrl}/avbase/get_index`;
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error get avbase index:', error);
      throw error;
    }
  }
}
