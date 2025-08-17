import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { PageExploreServiceService } from '../../services/page-explore.service';
import { CommonService } from '../../../../common.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {
  RankingTypeOfWorks,
  ActressRanking,
  RankingItem,
} from '../../models/page-explore';

@Component({
  selector: 'app-fanza',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './fanza.component.html',
  styleUrl: './fanza.component.css',
})
export class FanzaComponent implements OnInit {
  RankingTypeOfWorks = RankingTypeOfWorks;
  currentPage: number = 1;
  actressList: ActressRanking[] = [];
  workRankingType: RankingTypeOfWorks = RankingTypeOfWorks.Weekly;

  workList: RankingItem[] = [];
  currentWorkPage: number = 1;

  constructor(
    private PageExploreService: PageExploreServiceService,
    private router: Router,
    private common: CommonService
  ) {}

  ngOnInit(): void {
    // ------- Actress -------
    const cachedData = this.PageExploreService.getRankingData();

    if (cachedData && cachedData.length > 0) {
      //加载缓存
      this.actressList = this.PageExploreService.getRankingData();
      this.currentPage = this.PageExploreService.getLastPage();
      this.workRankingType = this.PageExploreService.getWorkRankingType();
    } else {
      this.PageExploreService.fetchActressRanking(1)
        .then((data) => {
          this.actressList = data;
          this.PageExploreService.setRankingData(data, 1);
        })
        .catch((error) => {
          console.error('Failed to fetch actress ranking:', error);
        });
    }

    // ------- Work -------
    const cachedWorkData = this.PageExploreService.getWorkRankingData();
    if (cachedWorkData && cachedWorkData.length > 0) {
      this.workList = cachedWorkData;
      this.currentWorkPage = this.PageExploreService.getLastWorkPage();
    } else {
      this.PageExploreService.fetchWorkRanking(1, this.workRankingType)
        .then((data) => {
          this.workList = data;
          this.PageExploreService.setWorkRankingData(
            data,
            1,
            this.workRankingType
          );
        })
        .catch((error) => {
          console.error('Failed to fetch work ranking:', error);
        });
    }
  }

  async cardClick(name: string) {
    try {
      this.router.navigate(['/performer', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async posterClick(name: string) {
    try {
      this.common.vauleOfPerformerSearch = name;
      this.router.navigate(['keywords', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  nextPage(): void {
    this.loadPage(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  loadPage(page: number): void {
    this.PageExploreService.fetchActressRanking(page).then((data) => {
      this.actressList = data;
      this.currentPage = page;
      this.PageExploreService.setRankingData(data, page);
    });
  }

  onWorkRankingTypeChange(value: RankingTypeOfWorks) {
    this.workRankingType = value;

    this.PageExploreService.fetchWorkRanking(1, this.workRankingType)
      .then((data) => {
        this.workList = data;
        this.PageExploreService.setWorkRankingData(
          data,
          1,
          this.workRankingType
        );
        this.currentWorkPage = 1;
      })
      .catch((error) => {
        console.error('Failed to fetch work ranking:', error);
      });
  }

  nextWorkPage(): void {
    const nextPage = this.currentWorkPage + 1;
    this.PageExploreService.fetchWorkRanking(nextPage, this.workRankingType)
      .then((data) => {
        this.workList = data;
        this.currentWorkPage = nextPage;
        this.PageExploreService.setWorkRankingData(
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
    this.PageExploreService.fetchWorkRanking(prevPage, this.workRankingType)
      .then((data) => {
        this.workList = data;
        this.currentWorkPage = prevPage;
        this.PageExploreService.setWorkRankingData(
          data,
          prevPage,
          this.workRankingType
        );
      })
      .catch((error) => {
        console.error('Failed to fetch previous work page:', error);
      });
  }
}
