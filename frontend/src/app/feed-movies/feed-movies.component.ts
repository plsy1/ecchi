import { HomeService } from '../api.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // 导入 CommonModule
import { Router } from '@angular/router'; // 导入 Router 和 RouterModule
import { MatIconModule } from '@angular/material/icon';
interface KeywordFeed {
  id: number;
  keyword: string;
  img: string;
}

@Component({
  selector: 'app-feed-movies',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './feed-movies.component.html',
  styleUrls: ['./feed-movies.component.css']
})
export class FeedMoviesComponent implements OnInit {
  // 用来保存获取的订阅数据
  keywordFeeds: KeywordFeed[] = [];

  constructor(
        private router: Router,
        private HomeService: HomeService

  ) {}

  ngOnInit() {
    // 在组件初始化时获取已订阅的数据
    this.getKeywordFeeds();
  }

  async getKeywordFeeds() {
    const url = '/api/v1/feed/getKeywordsFeedList';
    try {
      const response = await fetch(url, {
        method: 'GET',  // 使用GET请求
        headers: {
          'Content-Type': 'application/json',  // 设置请求头
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: KeywordFeed[] = await response.json();  // 解析返回的数据并确保其类型
      this.keywordFeeds = data;
    } catch (error) {
      console.error('Error fetching keyword feeds:', error);
    }
  }

  async onUnsubscribeClick(movie: any) {
    try {
      this.HomeService.removeKeywordsRSS(movie.keyword);
      this.getKeywordFeeds();
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async onMovieCardClick(movie: any) {
    console.log('Movie clicked:', movie);
    try {
      this.router.navigate(['movies',movie.link,movie.keyword]); // 执行路由跳转到根路由（/）
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
  
}