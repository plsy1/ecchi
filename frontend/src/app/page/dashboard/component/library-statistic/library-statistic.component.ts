import { DashboardService } from './../../service/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EmbyItemCounts } from '../../models/dashboard.interface';
@Component({
  selector: 'app-library-statistic',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './library-statistic.component.html',
  styleUrl: './library-statistic.component.css',
})
export class LibraryStatisticComponent implements OnInit {
  counts: EmbyItemCounts | null = null;

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.counts = await this.dashboardService.getEmbyItemTotalCount();
    } catch (error) {
      console.error('Failed to load Library Statistic data.', error);
    }
  }

  getIconClass(key: string): string {
    switch (key) {
      case 'MovieCount':
        return 'fas fa-film';
      case 'SeriesCount':
        return 'fas fa-tv';
      case 'EpisodeCount':
        return 'fas fa-play-circle';
      case 'GameCount':
        return 'fas fa-gamepad';
      case 'ArtistCount':
        return 'fas fa-user';
      case 'ProgramCount':
        return 'fas fa-desktop';
      case 'MusicVideoCount':
        return 'fas fa-music';
      case 'SongCount':
        return 'fas fa-music';
      case 'AlbumCount':
        return 'fas fa-compact-disc';
      case 'BookCount':
        return 'fas fa-book';
      case 'BoxSetCount':
        return 'fas fa-box';
      case 'ItemCount':
        return 'fas fa-layer-group';
      default:
        return 'fas fa-folder';
    }
  }
}
