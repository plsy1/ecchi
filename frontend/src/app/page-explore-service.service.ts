export interface ActressRanking {
  rank: string;
  name: string;
  image: string;
  profile_url: string;
  latest_work: string;
  latest_work_url: string;
  work_count: number;
}

import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PageExploreServiceService {
  private isDev = !environment.production;
  private apiUrl = this.isDev ? 'http://localhost:8964/api/v1' : '/api/v1';

  private actressRankingCache: ActressRanking[] = [];
  private lastFetchedPage: number = 1;

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

  fetchActressRanking(page: number): Promise<ActressRanking[]> {
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
}
