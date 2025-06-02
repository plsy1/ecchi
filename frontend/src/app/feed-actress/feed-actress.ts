import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ActressCollectListComponent } from '../actress-collect-list/actress-collect-list.component';
import { ActressFeedListComponent } from '../actress-feed-list/actress-feed-list.component';

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [CommonModule, MatIconModule, ActressFeedListComponent, ActressCollectListComponent ],
  templateUrl: './feed-actress.html',
  styleUrl: './feed-actress.css',
})

export class FeedActress {

}
