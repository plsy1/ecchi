import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface ActressList {
  title: string;
  created_at: string;
  url: string;
  id: number;
  description: string;
}

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './feed-actress.html',
  styleUrl: './feed-actress.css',
})

export class FindComponent {
  ActressList: ActressList[] = [];
  constructor(private homeService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.homeService.getActressFeeds().then((data: ActressList[]) => {
      this.ActressList = data;
    }).catch(error => {
      console.error('Error fetching actress feeds:', error);
    });
  }

  async onClick(name: string) {
    try {
      const results = await this.homeService.discoverByActress(name, 1);
      this.homeService.currentPage = 1;
      this.router.navigate(['/actress', name]);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async onUnsubscribeClick(event: MouseEvent, movie: any) {
    event.stopPropagation();
    try {
      this.homeService.removeFeedsRSS(movie.url);
      this.homeService.getActressFeeds().then((data: ActressList[]) => {
        this.ActressList = data;
      }).catch(error => {
        console.error('Error fetching actress feeds:', error);
      });
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
}
