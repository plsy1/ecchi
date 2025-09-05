import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  RankingTypeOfWorks,
  ActressRanking,
  RankingItem,
  JavtrailersDailyRelease,
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

  constructor(private http: HttpClient, private common: CommonService) {}

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

  fetchActressRanking(page: number): Observable<ActressRanking[]> {
    const url = `${this.common.apiUrl}/fanza/monthlyactress?page=${page}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
    });

    return this.http.get<ActressRanking[]>(url, { headers });
  }

  fetchWorkRanking(
    page: number,
    term: RankingTypeOfWorks
  ): Observable<RankingItem[]> {
    const url = `${this.common.apiUrl}/fanza/monthlyworks?page=${page}&term=${term}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
    });

    return this.http.get<RankingItem[]>(url, { headers });
  }

  getAvbaseIndex(): Observable<any> {
    const url = `${this.common.apiUrl}/avbase/get_index`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
    });

    return this.http.get(url, { headers });
  }

  getJavtrailersReleaseByDate(
    yyyymmdd: string
  ): Observable<JavtrailersDailyRelease> {
    const url = `${this.common.apiUrl}/javtrailers/getReleasebyDate?yyyymmdd=${yyyymmdd}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<JavtrailersDailyRelease>(url, { headers });
  }
}
