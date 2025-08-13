import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface ActressList {
  name: string;
  created_at: string;
  avatar_url: string;
  id: number;
}

@Component({
  selector: 'app-actress-collect-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './actress-collect-list.component.html',
  styleUrl: './actress-collect-list.component.css',
})
export class ActressCollectListComponent {
  ActressList: ActressList[] = [];
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService
      .getActressCollect()
      .then((data: ActressList[]) => {
        this.ActressList = data;
      })
      .catch((error) => {
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
      this.apiService.removeActressCollect(movie.avatar_url);
      this.apiService
        .getActressCollect()
        .then((data: ActressList[]) => {
          this.ActressList = data;
        })
        .catch((error) => {
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
