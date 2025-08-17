import { Component } from '@angular/core';
import { PerformerSubscriptionService } from '../../service/performer-subscription.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface performerList {
  name: string;
  created_at: string;
  avatar_url: string;
  id: number;
}

@Component({
  selector: 'app-list-performer-collect',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './collect.component.html',
  styleUrl: './collect.component.css',
})
export class PerformerCollectionListComponent {
  ActressList: performerList[] = [];
  constructor(
    private PerformerSubscriptionService: PerformerSubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.PerformerSubscriptionService.getActressCollect()
      .then((data: performerList[]) => {
        this.ActressList = data;
      })
      .catch((error) => {
        console.error('Error fetching actress feeds:', error);
      });
  }

  async onClick(name: string) {
    try {
      this.router.navigate(['/performer', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async onUnsubscribeClick(event: MouseEvent, movie: any) {
    event.stopPropagation();
    try {
      this.PerformerSubscriptionService.removeActressCollect(movie.avatar_url);
      this.PerformerSubscriptionService.getActressCollect()
        .then((data: performerList[]) => {
          this.ActressList = [...data];
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
