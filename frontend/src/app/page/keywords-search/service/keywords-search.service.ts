import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
@Injectable({
  providedIn: 'root',
})
export class KeywordsSearchService {
  public discoverResults: any[] = [];
  public searchKeyWords: string = '';
  public currentPage: number = 1;
  public discoverType: number = 1;
  public actressNumberFilter: string = '0';

  public selectedMovie: any = null;

  constructor(private common: CommonService) {}

  saveState(
    results: any[],
    keywords: string,
    page: number,
    actressNumberFilter: string
  ) {
    this.discoverResults = results;
    this.searchKeyWords = keywords;
    this.currentPage = page;
    this.actressNumberFilter = actressNumberFilter;
  }

  saveSelectedMovie(movie: any) {
    this.selectedMovie = movie;
  }

  getSelectedMovie() {
    return this.selectedMovie;
  }

  async discoverByKeywords(filter_value: string, page: number): Promise<any> {
    const url = `${this.common.apiUrl}/avbase/keywords?keywords=${filter_value}&page=${page}`;

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
}
