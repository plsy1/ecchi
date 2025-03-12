import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // 导入 ActivatedRoute 用于获取路由参数
import { HttpClient } from '@angular/common/http'; // 导入 HttpClient 用于请求 API 请求
import { CommonModule } from '@angular/common'; // 引入 CommonModule
import { MatCardModule } from '@angular/material/card'; // 引入 MatCardModule
import { MatChipsModule } from '@angular/material/chips'; // 引入 MatChipsModule (更正名称)
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // 引入 MatProgressSpinnerModule
import { HomeService } from '../api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movieinformation',
  standalone: true,
  imports: [
    CommonModule, // 导入 CommonModule 以便使用 ngIf、ngFor 等指令
    MatCardModule, // 导入 MatCardModule
    MatChipsModule, // 更正为 MatChipsModule
    MatProgressSpinnerModule, // 导入 MatProgressSpinnerModule
    MatIconModule,
  ],
  templateUrl: './movieinformation.component.html',
  styleUrls: ['./movieinformation.component.css'],
})
export class MovieinformationComponent implements OnInit {
  movieData: any; // 存储电影数据
  movieLink: string = ''; // 存储电影的 Link
  movieId: string = ''; // 存储电影的 ID
  isLoading: boolean = false;

  constructor(
    private getRoute: ActivatedRoute, // 用于获取路由中的参数据
    private homeService: HomeService,
    private router: Router,
      private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // 获取路由中的电影 ID 参数
    this.getRoute.paramMap.subscribe((params) => {
      this.movieLink = params.get('link') || ''; // 获取 URL 中的动态参数
      this.movieId = params.get('id') || ''; // 获取 URL 中的动态参数
      this.loadMovieData(this.movieLink); // 加载电影数据
    });
  }


  loadMovieData(movieUrl: string): void {
    this.isLoading = true; // 开始加载时显示加载进度条
    this.homeService
      .singleMovieInformation(encodeURIComponent(movieUrl))
      .then((data) => {
        this.movieData = data; // 将返回的数据赋值给 movieData
        this.isLoading = false; // 数据加载完毕，隐藏加载进度条
      })
      .catch((error) => {
        console.error('加载电影信息失败', error);
        this.isLoading = false; // 出错时也隐藏加载进度条
      });
  }

  // 处理下载按钮的点击事件
  async downloadMovie(): Promise<void> {
    try {
      const results = await this.homeService.search(this.movieId);
      this.router.navigate(['/']);
      this.homeService.movieLink = this.movieLink
      this.homeService.queryKeywords = this.movieId
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  // 处理订阅按钮的点击事件
  async subscribeToMovie(): Promise<void> {
    try {
      console.log(this.movieData.cover_image)
      const results = await this.homeService.addKeywordsRSS(this.movieId,this.movieData.cover_image,this.movieLink);
      if (results) {
        this.snackBar.open('Added successfully.', 'Close', { duration: 2000 });
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async searchByActressName(name: string) {
    try {
      const results = await this.homeService.discoverByActress(name,1);
      this.homeService.currentPage = 1;
      this.router.navigate(['/actress',name]);
    } catch(error) {
      console.error('Search failed:', error);
    }
  }
}
