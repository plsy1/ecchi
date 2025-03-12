import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor

import { ActivatedRoute } from '@angular/router'; // 导入 ActivatedRoute 用于获取路由参数
import { HomeService } from '../api.service';
import { Router } from '@angular/router';
import { SubComponent } from "../movies-search-results/movies-search-results.component";
import { ActressInformationComponent } from '../actress-information/actress-information.component';

@Component({
  selector: 'app-actress-page',
  standalone: true,
  imports: [CommonModule, SubComponent,ActressInformationComponent],  // Add CommonModule here
  templateUrl: './actress-page.component.html',
  styleUrl: './actress-page.component.css'
})
export class ActressPageComponent {

  name: string = ''; // 存储电影的 ID
  actressData: any;

    constructor(
      private getRoute: ActivatedRoute, // 用于获取路由中的参数据
      private homeService: HomeService,
      private router: Router,
    ) {}

  ngOnInit(): void {
    // 获取路由中的电影 ID 参数
    this.getRoute.paramMap.subscribe((params) => {
      this.name = params.get('name') || ''; // 获取 URL 中的动态参数
      this.homeService.discoverByActress(this.name,1);
    });
  }

  loadActressInformation(name: string): void {
    this.homeService
      .getActressInformation(encodeURIComponent(name))
      .then((data) => {
        this.actressData = data; // 将返回的数据赋值给 movieData
      })
      .catch((error) => {
        console.error('加载电影信息失败', error);
      });
  }

  subscribeActress(rssLink: string): void {
    this.homeService.addFeedsRSS(rssLink, this.name, '')
      .then((response) => {
        // 检查返回的 status code 是否是 200
        if (response.status === 200) {
          console.log('订阅成功！');
          // 在此处理订阅成功后的逻辑，例如显示提示、更新 UI 等
          alert('订阅成功！');
        } else {
          alert('订阅失败，请稍后再试。');
        }
      })
      .catch((error) => {
        alert('订阅失败，请稍后再试。');
      });
  }
}
