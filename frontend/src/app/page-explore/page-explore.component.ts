import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { PageExploreServiceService } from './services/page-explore.service';
import {
  RankingTypeOfWorks,
  ActressRanking,
  RankingItem,
} from './models/page-explore';

@Component({
  selector: 'app-page-explore',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatTabsModule,
  ],
  templateUrl: './page-explore.component.html',
  styleUrl: './page-explore.component.css',
})
export class PageExploreComponent {
  RankingTypeOfWorks = RankingTypeOfWorks;
  actressList: ActressRanking[] = [];
  currentPage: number = 1;
  workRankingType: RankingTypeOfWorks = RankingTypeOfWorks.Weekly;

  workList: RankingItem[] = [];
  currentWorkPage: number = 1;

  avbaseIndexData: any;

  constructor(
    private pageExploreData: PageExploreServiceService,
    private ApiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ------- Actress -------
    const cachedData = this.pageExploreData.getRankingData();

    if (cachedData && cachedData.length > 0) {
      //加载缓存
      this.actressList = this.pageExploreData.getRankingData();
      this.currentPage = this.pageExploreData.getLastPage();
      this.workRankingType = this.pageExploreData.getWorkRankingType();
    } else {
      this.pageExploreData
        .fetchActressRanking(1)
        .then((data) => {
          this.actressList = data;
          this.pageExploreData.setRankingData(data, 1);
        })
        .catch((error) => {
          console.error('Failed to fetch actress ranking:', error);
        });
    }

    // ------- Work -------
    const cachedWorkData = this.pageExploreData.getWorkRankingData();
    if (cachedWorkData && cachedWorkData.length > 0) {
      this.workList = cachedWorkData;
      this.currentWorkPage = this.pageExploreData.getLastWorkPage();
    } else {
      this.pageExploreData
        .fetchWorkRanking(1, this.workRankingType)
        .then((data) => {
          this.workList = data;
          this.pageExploreData.setWorkRankingData(
            data,
            1,
            this.workRankingType
          );
        })
        .catch((error) => {
          console.error('Failed to fetch work ranking:', error);
        });
    }

    // ------- AVbase Index -------

    this.loadAvbaseIndex();
  }

  loadPage(page: number): void {
    this.pageExploreData.fetchActressRanking(page).then((data) => {
      this.actressList = data;
      this.currentPage = page;
      this.pageExploreData.setRankingData(data, page);
    });
  }

  nextPage(): void {
    this.loadPage(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  nextWorkPage(): void {
    const nextPage = this.currentWorkPage + 1;
    this.pageExploreData
      .fetchWorkRanking(nextPage, this.workRankingType)
      .then((data) => {
        this.workList = data;
        this.currentWorkPage = nextPage;
        this.pageExploreData.setWorkRankingData(
          data,
          nextPage,
          this.workRankingType
        );
      })
      .catch((error) => {
        console.error('Failed to fetch next work page:', error);
      });
  }

  prevWorkPage(): void {
    if (this.currentWorkPage <= 1) return;
    const prevPage = this.currentWorkPage - 1;
    this.pageExploreData
      .fetchWorkRanking(prevPage, this.workRankingType)
      .then((data) => {
        this.workList = data;
        this.currentWorkPage = prevPage;
        this.pageExploreData.setWorkRankingData(
          data,
          prevPage,
          this.workRankingType
        );
      })
      .catch((error) => {
        console.error('Failed to fetch previous work page:', error);
      });
  }

  async cardClick(name: string) {
    try {
      this.router.navigate(['/actress', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }
  async posterClick(name: string) {
    try {
      this.ApiService.queryKeywords = name;
      this.router.navigate(['search', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  onWorkRankingTypeChange(value: RankingTypeOfWorks) {
    this.workRankingType = value;

    this.pageExploreData
      .fetchWorkRanking(1, this.workRankingType)
      .then((data) => {
        this.workList = data;
        this.pageExploreData.setWorkRankingData(data, 1, this.workRankingType);
        this.currentWorkPage = 1;
      })
      .catch((error) => {
        console.error('Failed to fetch work ranking:', error);
      });
  }

  async loadAvbaseIndex() {
    try {
      this.avbaseIndexData = await this.ApiService.getAvbaseIndex();
      console.log('Avbase Index Data:', this.avbaseIndexData);
    } catch (error) {
      console.error('Failed to load Avbase index:', error);
    }
  }
}
