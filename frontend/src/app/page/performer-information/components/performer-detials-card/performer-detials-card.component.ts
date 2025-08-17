import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { PerformerService } from '../../service/performer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-performer-detials-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './performer-detials-card.component.html',
  styleUrls: ['./performer-detials-card.component.css'],
})
export class ActressInformationComponent {
  name: string = '';
  performerInformation: any;

  constructor(
    private getRoute: ActivatedRoute,
    private service: PerformerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getRoute.paramMap.subscribe((params) => {
      this.name = params.get('name') || '';
      if (this.name === this.service.name) {
        this.performerInformation = this.service.performerInformation;
      } else {
        this.service.saveName(this.name);
        this.loadActressInformation(this.name);
      }
    });
  }

  loadActressInformation(name: string): void {
    this.service
      .getActressInformation(encodeURIComponent(name))
      .then((data) => {
        this.performerInformation = data;
        this.service.savePerformerInformation(data);
      })
      .catch((error) => {
        console.error('Failed to load', error);
      });
  }

  subscribeActress(rssLink: string): void {
    this.service
      .addFeedsRSS(rssLink, this.name, '')
      .then((response) => {
        if (response.status === 200) {
          this.snackBar.open('Added successfully', 'Close', { duration: 2000 });
        } else {
          this.snackBar.open('Failed to add', 'Close', { duration: 2000 });
        }
      })
      .catch((error) => {
        this.snackBar.open('Failed to add', 'Close', { duration: 2000 });
      });
  }

  collectActress(rssLink: string): void {
    this.service
      .addActressCollect(rssLink, this.name)
      .then((response) => {
        if (response.status === 200) {
          this.snackBar.open('Added successfully', 'Close', { duration: 2000 });
        } else {
          this.snackBar.open('Failed to add', 'Close', { duration: 2000 });
        }
      })
      .catch((error) => {
        this.snackBar.open('Failed to add', 'Close', { duration: 2000 });
      });
  }

  getFaIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'fab fa-twitter';
      case 'instagram':
        return 'fab fa-instagram';
      case 'facebook':
        return 'fab fa-facebook';
      case 'youtube':
        return 'fab fa-youtube';
      case 'tiktok':
        return 'fab fa-tiktok';
      default:
        return 'fab fa-wikipedia-w';
    }
  }
}
