import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface EmbyItemCounts {
  MovieCount: number;
  SeriesCount: number;
  EpisodeCount: number;
  GameCount: number;
  ArtistCount: number;
  ProgramCount: number;
  GameSystemCount: number;
  TrailerCount: number;
  SongCount: number;
  AlbumCount: number;
  MusicVideoCount: number;
  BoxSetCount: number;
  BookCount: number;
  ItemCount: number;
}

@Component({
  selector: 'app-card-emby-total-count',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './card-emby-total-count.component.html',
  styleUrls: ['./card-emby-total-count.component.css'],
})
export class CardEmbyTotalCountComponent implements OnInit {
  counts: EmbyItemCounts | null = null;

  constructor(public ApiService: ApiService) {}

  async ngOnInit() {
    try {
      this.counts = await this.ApiService.getEmbyItemTotalCount();
    } catch (err) {
      console.error('Failed to get Emby item counts:', err);
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
