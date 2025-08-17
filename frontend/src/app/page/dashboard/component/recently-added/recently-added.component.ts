import { Component, OnInit } from '@angular/core';
import { DashboardService } from './../../service/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { EmbyLatestItem } from '../../models/dashboard.interface';

@Component({
  selector: 'app-recently-added',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './recently-added.component.html',
  styleUrl: './recently-added.component.css',
})
export class RecentlyAddedComponent implements OnInit {
  latestItems: EmbyLatestItem[] = [];
  constructor(private dashboardService: DashboardService) {}
  async ngOnInit(): Promise<void> {
    try {
      this.latestItems = await this.dashboardService.getEmbyLatestItems();
    } catch (error) {
      console.error('Failed to load Emby Recently Added data.', error);
    }
  }

onImageError(event: Event, item: any) {
  item.hideImage = true;
}
}
