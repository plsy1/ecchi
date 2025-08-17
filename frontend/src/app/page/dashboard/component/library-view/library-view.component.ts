import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from './../../service/dashboard.service';
import { EmbyView } from '../../models/dashboard.interface';
@Component({
  selector: 'app-library-view',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './library-view.component.html',
  styleUrl: './library-view.component.css',
})
export class LibraryViewComponent implements OnInit {
  views: EmbyView[] = [];
  constructor(private dashboardService: DashboardService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.views = await this.dashboardService.getEmbyViews();
    } catch (error) {
      console.error('Failed to load Emby View data.', error);
    }
  }

  onImageError(event: Event, view: any) {
    const img = event.target as HTMLImageElement;
    img.src = view.primary;
  }
}
