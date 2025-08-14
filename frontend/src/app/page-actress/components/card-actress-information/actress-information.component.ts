import { ActressInformationService } from './services/actress-information.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-actress-information',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './actress-information.component.html',
  styleUrls: ['./actress-information.component.css'],
})
export class ActressInformationComponent {
  name: string = '';
  actressData: any;

  constructor(
    private getRoute: ActivatedRoute,
    private ApiService: ApiService,
    private ActressInformation: ActressInformationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getRoute.paramMap.subscribe((params) => {
      this.name = params.get('name') || '';
      if (
        this.ActressInformation.actressData &&
        this.name == this.ActressInformation.actressData.name
      ) {
        this.actressData = this.ActressInformation.actressData;
      } else {
        this.loadActressInformation(this.name);
      }
    });
  }

  loadActressInformation(name: string): void {
    this.ApiService.getActressInformation(encodeURIComponent(name))
      .then((data) => {
        this.actressData = data;
        this.ActressInformation.saveState(this.actressData);
      })
      .catch((error) => {
        console.error('加载电影信息失败', error);
      });
  }

  subscribeActress(rssLink: string): void {
    this.ApiService.addFeedsRSS(rssLink, this.name, '')
      .then((response) => {
        if (response.status === 200) {
          console.log('订阅成功！');

          this.snackBar.open('添加成功', 'Close', { duration: 2000 });
        } else {
          this.snackBar.open('添加失败', 'Close', { duration: 2000 });
        }
      })
      .catch((error) => {
        this.snackBar.open('添加订阅失败', 'Close', { duration: 2000 });
      });
  }

  collectActress(rssLink: string): void {
    this.ApiService.addActressCollect(rssLink, this.name)
      .then((response) => {
        if (response.status === 200) {
          console.log('订阅成功！');

          this.snackBar.open('添加成功', 'Close', { duration: 2000 });
        } else {
          this.snackBar.open('添加失败', 'Close', { duration: 2000 });
        }
      })
      .catch((error) => {
        this.snackBar.open('添加订阅失败', 'Close', { duration: 2000 });
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
        return 'fas fa-globe';
    }
  }
}
