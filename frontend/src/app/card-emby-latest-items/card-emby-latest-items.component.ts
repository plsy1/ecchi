import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
interface EmbyLatestItem {
  name: string;
  primary: string;
  serverId: string;
  indexLink: string;
}

@Component({
  selector: 'app-card-emby-latest-items',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './card-emby-latest-items.component.html',
  styleUrls: ['./card-emby-latest-items.component.css']
})
export class CardEmbyLatestItemsComponent implements OnInit {

  latestItems: EmbyLatestItem[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(public ApiService: ApiService) {}

  async ngOnInit() {
    this.loading = true;
    this.error = null;

    try {
      const data = await this.ApiService.getEmbyLatestItems();
      this.latestItems = data;
    } catch (err: any) {
      console.error('Error fetching latest items:', err);
      this.error = err.message || 'Unknown error';
    } finally {
      this.loading = false;
    }
  }


  formatName(name: string): string {
    return name.length > 20 ? name.slice(0, 20) + '…' : name;
  }
}