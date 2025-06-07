import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MovieStateService {
  public discoverResults: any[] = [];
  public searchKeyWords: string = '';
  public currentPage: number = 1;
  public discoverType: number = 1;
  public actressNumberFilter: string = '0';

  saveState(results: any[], keywords: string, page: number, type: number, actressNumberFilter: string) {
    this.discoverResults = results;
    this.searchKeyWords = keywords;
    this.currentPage = page;
    this.discoverType = type;
    this.actressNumberFilter = actressNumberFilter;
  }
}