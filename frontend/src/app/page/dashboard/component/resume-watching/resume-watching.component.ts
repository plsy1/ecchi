import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from './../../service/dashboard.service';
import { ResumeItem } from '../../models/dashboard.interface';
@Component({
  selector: 'app-resume-watching',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './resume-watching.component.html',
  styleUrl: './resume-watching.component.css',
})
export class ResumeWatchingComponent implements OnInit {
  resumeItems: ResumeItem[] = [];

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.resumeItems = await this.dashboardService.getEmbyResumeItems();
    } catch (error) {
      console.error('Failed to load Emby Resume watching data.', error);
    }
  }

onImageError(event: Event, item: any) {
  item.hideImage = true;
}
}
