import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // 导入 CommonModule
import { HomeService } from '../api.service';  // 引入 HomeService 和 Movie 类型
import { Router } from '@angular/router'; // 导入 Router 和 RouterModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sub',
  standalone: true,
  templateUrl: './movies-search-results.component.html',
  styleUrls: ['./movies-search-results.component.css'],
  imports:[CommonModule,MatProgressSpinnerModule,MatIconModule]
})
export class SubComponent implements OnInit {
  discoverResults: any[] = [];  // 用于存储返回的电影数据
  isLoading: boolean = false;  // 控制加载状态，防止重复加载
  searchKeyWords: string = '';


  constructor(
    public homeService: HomeService,
    private router: Router,
  ) {}


  ngOnInit(): void {
    this.homeService.discoverResults$.subscribe((results) => {
      this.discoverResults = results;
    });
    this.homeService.discoverByKeywordsResults$.subscribe((keyword) => {
      this.searchKeyWords = keyword;
    });
  }

  loadDiscoverData(filter_value: string,video_type: string,page: number): void {
    if (this.isLoading == true) return;
    this.isLoading = true;
    if (this.homeService.discoverType === 1) {
      this.homeService.discoverByKeywords(filter_value,page).then(data => {
        console.log('discoverByKeywords 数据加载成功:', data);  // 打印返回的电影数据
        this.discoverResults = data.movies;  // 直接使用原始数据
        this.isLoading = false;
      }).catch(error => {
        console.error('加载失败:', error);
      });
    } else if (this.homeService.discoverType === 2) {
      this.homeService.discoverByActress(filter_value,page).then(data => {
        console.log('discover 数据加载成功:', data);  // 打印返回的电影数据
        this.discoverResults = data.movies;  // 直接使用原始数据
        this.isLoading = false;
      }).catch(error => {
        console.error('加载失败:', error);
      });
    }
  }
    // 当图片加载失败时触发
    onImageError(event: any): void {
      // event.target.src = '/assets/cover.jpg';  // 默认图片
    }


    // 点击电影卡片时执行的函数
    // async onMovieClick(movie: any) {
    //   console.log('Movie clicked:', movie);
    //   try {
    //     // 调用 HomeService 进行搜索
    //     const results = await this.homeService.search(movie.id);
    //     console.log('Search results:', results);
    //     this.router.navigate(['/']); // 执行路由跳转到根路由（/）
    //   } catch (error) {
    //     // 搜索失败时输出错误并显示 Snackbar 提示
    //     console.error('Search failed:', error);
    //   }
    // }

    // 点击电影卡片时执行的函数
    async onMovieClick(movie: any) {
      console.log('Movie clicked:', movie);
      try {
        this.router.navigate(['movies',movie.avbase_link,movie.id]); // 执行路由跳转到根路由（/）
      } catch (error) {
        console.error('Search failed:', error);
      }
    }

  loadPreviousPage(): void {
    if (this.homeService.currentPage > 1) {
      this.homeService.currentPage -=1;
      this.loadDiscoverData(this.searchKeyWords, 'normal', this.homeService.currentPage);  // 加载上一页
    }
  }


  loadNextPage(): void {
    this.homeService.currentPage +=1;
    this.loadDiscoverData(this.searchKeyWords, 'normal', this.homeService.currentPage);  // 加载下一页
  }
}