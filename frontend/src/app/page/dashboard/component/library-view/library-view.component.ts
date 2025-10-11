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

ngOnInit(): void {
  this.dashboardService.getEmbyViews().subscribe({
    next: (data) => {
      this.views = data;
    },
    error: (err) => {
      console.error('Failed to load Emby View data.', err);
    },
  });
}


  onImageError(event: Event, item: any) {
  item.hideImage = true;
}
}
