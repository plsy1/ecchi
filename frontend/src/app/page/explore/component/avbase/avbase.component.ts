import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { PageExploreServiceService } from '../../services/page-explore.service';
import { CommonService } from '../../../../common.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-avbase',
  standalone: true,
  imports: [MatTabsModule, CommonModule],
  templateUrl: './avbase.component.html',
  styleUrl: './avbase.component.css',
})
export class AvbaseComponent implements OnInit {
  avbaseIndexData: any;
  constructor(
    private PageExploreService: PageExploreServiceService,
    private router: Router,
    private common: CommonService
  ) {}

  ngOnInit(): void {
    this.loadAvbaseIndex();
  }

  async loadAvbaseIndex() {
    try {
      this.avbaseIndexData = await this.PageExploreService.getAvbaseIndex();
    } catch (error) {
      console.error('Failed to load Avbase index:', error);
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
}
