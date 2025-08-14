import { Component } from '@angular/core';
import { ApiService } from '../../../api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface ResumeItem {
  name: string;
  primary: string;
    primary_local:string;
  serverId: string;
  indexLink: string;
  PlayedPercentage: number;
  ProductionYear?: number;
}

@Component({
  selector: 'app-card-emby-resume-items',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './card-emby-resume-items.component.html',
  styleUrls: ['./card-emby-resume-items.component.css']
})
export class CardEmbyResumeItemsComponent {
  resumeItems: ResumeItem[] = [];

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    await this.loadResumeItems();
  }

  async loadResumeItems() {
    try {
      this.resumeItems = await this.apiService.getEmbyResumeItems();
    } catch (error) {
      console.error('Failed to load resume items:', error);
    }
  }

  formatName(name: string): string {
    // 可根据需要截断长名字
    return name.length > 20 ? name.slice(0, 17) + '...' : name;
  }
    onImageError(event: Event, view: any) {
  const img = event.target as HTMLImageElement;
  img.src = view.primary;
}
}