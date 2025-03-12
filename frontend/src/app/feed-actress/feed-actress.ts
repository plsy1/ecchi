import { Component } from '@angular/core';
import { HomeService } from '../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';

interface ActressList {
  title: string;
  created_at: string;
  url: string;
  id: number;
  description: string

}

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './feed-actress.html',
  styleUrl: './feed-actress.css',
})
export class FindComponent {

  ActressList: ActressList[] = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getActressFeeds();
  }

  async getActressFeeds() {
    const url = '/api/v1/feed/getFeedsList';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: ActressList[] = await response.json();
      this.ActressList = data;
    } catch (error) {
      console.error('Error fetching keyword feeds:', error);
    }
  }

  async onClick(name: string) {
    try {
      const results = await this.homeService.discoverByActress(name,1);
      this.homeService.currentPage = 1;
      this.router.navigate(['/actress',name]);
    } catch(error) {
      console.error('Search failed:', error);
    }
  }

  async onUnsubscribeClick(event: MouseEvent,movie: any) {
    event.stopPropagation();
    try {
      this.homeService.removeFeedsRSS(movie.url);
      this.getActressFeeds();
    } catch (error) {
      console.error('Search failed:', error);
    }
  }


}



