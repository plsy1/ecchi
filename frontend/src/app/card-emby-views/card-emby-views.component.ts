import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-card-emby-views',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './card-emby-views.component.html',
  styleUrls: ['./card-emby-views.component.css']
})
export class CardEmbyViewsComponent implements OnInit {
  views: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadViews();
  }

  async loadViews() {
    try {
      this.views = await this.apiService.getEmbyViews();
    } catch (error) {
      console.error('Failed to load Emby views:', error);
    }
  }

  onImageError(event: Event, view: any) {
  const img = event.target as HTMLImageElement;
  img.src = view.primary;
}
}