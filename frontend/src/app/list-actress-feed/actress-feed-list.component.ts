import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface ActressList {
  title: string;
  created_at: string;
  url: string;
  id: number;
  description: string;
}


@Component({
  selector: 'app-actress-feed-list',
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule,MatButtonModule,MatMenuModule],
  templateUrl: './actress-feed-list.component.html',
  styleUrl: './actress-feed-list.component.css'
})
export class ActressFeedListComponent {

    ActressList: ActressList[] = [];
    constructor(private homeService: ApiService, private router: Router) {}
  
    ngOnInit(): void {
      this.homeService.getActressFeed().then((data: ActressList[]) => {
        this.ActressList = data;
      }).catch(error => {
        console.error('Error fetching actress feeds:', error);
      });
    }
  
    async onClick(name: string) {
      try {
        this.router.navigate(['/actress', name]);
      } catch (error) {
        console.error('Failed:', error);
      }
    }
  
    async onUnsubscribeClick(event: MouseEvent, movie: any) {
      event.stopPropagation();
      try {
        this.homeService.removeFeedsRSS(movie.url);
        this.homeService.getActressFeed().then((data: ActressList[]) => {
          this.ActressList = data;
        }).catch(error => {
          console.error('Error fetching actress feeds:', error);
        });
      } catch (error) {
        console.error('Failed:', error);
      }
    }

    contextActress: any;

  openMenu(event: Event, actress: any) {
    event.stopPropagation();
    this.contextActress = actress;
  }


}
