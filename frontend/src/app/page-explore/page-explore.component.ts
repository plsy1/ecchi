import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  PageExploreServiceService,
  ActressRanking,
} from '../page-explore-service.service';

@Component({
  selector: 'app-page-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-explore.component.html',
  styleUrl: './page-explore.component.css',
})
export class PageExploreComponent {
  actressList: ActressRanking[] = [];
  currentPage: number = 1;
  constructor(private pageExploreData: PageExploreServiceService) {}

  ngOnInit(): void {
    this.loadPage(this.currentPage);
  }

  loadPage(page: number): void {
    this.pageExploreData.fetchActressRanking(page).then((data) => {
      this.actressList = data;
      this.currentPage = page;
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

  
}
