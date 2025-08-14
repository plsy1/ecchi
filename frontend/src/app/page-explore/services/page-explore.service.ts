import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RankingTypeOfWorks,ActressRanking,RankingItem } from '../models/page-explore';
@Injectable({
  providedIn: 'root',
})
export class PageExploreServiceService {
  private isDev = !environment.production;
  private apiUrl = this.isDev ? 'http://localhost:8964/api/v1' : '/api/v1';

  private actressRankingCache: ActressRanking[] = [];
  private lastFetchedPage: number = 1;

  private workRankingCache: RankingItem[] = [];
  private lastFetchedWorkPage: number = 1;
  private workRankingType: RankingTypeOfWorks = RankingTypeOfWorks.Weekly;

  constructor() {}

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
    const url = `${this.apiUrl}/fanza/monthlyactress?page=${page}`;
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
    const url = `${this.apiUrl}/fanza/monthlyworks?page=${page}&term=${term}`;
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
}
