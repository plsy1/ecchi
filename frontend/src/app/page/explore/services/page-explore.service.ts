import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  RankingTypeOfWorks,
  ActressRanking,
  RankingItem,
  JavtrailersDailyRelease,
  AvbaseIndexData,
} from '../models/page-explore';
import { AvbaseEverydayReleaseByPrefix } from '../models/avbase-everyday-release';
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

  private CalenderData: JavtrailersDailyRelease | null = null;

  private AvbaseIndexData: AvbaseIndexData | null = null;

  private avbaseEverydayReleaseData: AvbaseEverydayReleaseByPrefix[] | null =
    null;

  getJavtrailersData(): JavtrailersDailyRelease | null {
    return this.CalenderData;
  }
  setJavtrailersData(data: JavtrailersDailyRelease): void {
    this.CalenderData = data;
  }

  // ===== Avbase =====

  getAvbaseEverydayReleaseData(): AvbaseEverydayReleaseByPrefix[] | null {
    return this.avbaseEverydayReleaseData;
  }

  setAvbaseEverydayReleaseData(data: AvbaseEverydayReleaseByPrefix[]): void {
    this.avbaseEverydayReleaseData = data;
  }

  getAvbaseIndexData(): AvbaseIndexData | null {
    return this.AvbaseIndexData;
  }

  setAvbaseIndexData(data: AvbaseIndexData): void {
    this.AvbaseIndexData = data;
  }

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

  getAvbaseReleaseByDate(yyyymmdd: string): Observable<any> {
    const url = `${this.common.apiUrl}/avbase/get_release_by_date?yyyymmdd=${yyyymmdd}`;

    const headers = new HttpHeaders({
      Accept: 'application/json',
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
