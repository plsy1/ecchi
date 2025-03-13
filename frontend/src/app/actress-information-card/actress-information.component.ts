import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actress-information',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './actress-information.component.html',
  styleUrls: ['./actress-information.component.css'],
})
export class ActressInformationComponent {
  name: string = '';
  actressData: any;

  constructor(
    private getRoute: ActivatedRoute,
    private homeService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getRoute.paramMap.subscribe((params) => {
      this.name = params.get('name') || '';
      this.loadActressInformation(this.name);
    });
  }

  loadActressInformation(name: string): void {
    this.homeService
      .getActressInformation(encodeURIComponent(name))
      .then((data) => {
        this.actressData = data;
      })
      .catch((error) => {
        console.error('加载电影信息失败', error);
      });
  }

  subscribeActress(rssLink: string): void {
    this.homeService
      .addFeedsRSS(rssLink, this.name, '')
      .then((response) => {
        if (response.status === 200) {
          console.log('订阅成功！');

          this.snackBar.open('添加订阅成功', 'Close', { duration: 2000 });
        } else {
          this.snackBar.open('添加订阅失败', 'Close', { duration: 2000 });
        }
      })
      .catch((error) => {
        this.snackBar.open('添加订阅失败', 'Close', { duration: 2000 });
      });
  }
}
