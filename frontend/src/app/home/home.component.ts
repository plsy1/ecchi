import { Component, OnInit, ViewChild, AfterViewInit,inject } from '@angular/core';
import { HomeService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DownloadOptionComponent } from '../download-option/download-option.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule],  // 包含模块
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  searchResults: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  query: string = '';  // 搜索关键字
  displayedColumns: string[] = ['indexer', 'title', 'size', 'seeders', 'publishDate'];
  dataSource = new MatTableDataSource<any>(this.searchResults);

  dialog: MatDialog = inject(MatDialog)

  // 获取 MatSort 实例
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    // 订阅 HomeService 中的搜索结果数据流
    this.homeService.searchResults$.subscribe((results) => {
      this.searchResults = results;
      this.dataSource.data = this.searchResults;
    });

    setTimeout(() => {  
      if (this.sort) {
        this.dataSource.sort = this.sort;
        this.sort.active = 'seeders';
        this.sort.direction = 'desc';
      }
    });
    
  }


  // 搜索方法
  async search(query: string): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      await this.homeService.search(query);  // 直接调用服务中的搜索方法
      this.loading = false;
    } catch (err) {
      this.error = '加载失败，请稍后再试';
      this.loading = false;
    }
  }

  // 当用户按回车时触发的搜索方法
  onSearchChange(): void {
    if (this.query.trim()) {
      this.search(this.query);
    } else {
      this.dataSource.data = [];  // 如果搜索框为空，清空表格数据
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {  
      if (this.sort) {
        this.dataSource.sort = this.sort;
        this.sort.active = 'seeders';
        this.sort.direction = 'desc';
      }
    });
  }


  onRowClick(row: any): void {
    const downloadUrl = row.magnetUrl || row.downloadUrl;
    const dialogRef = this.dialog.open(DownloadOptionComponent, {
      data: {
        downloadUrl: downloadUrl, // 传递数据给对话框组件
      }
    });

    this.dataSource.data = [...this.dataSource.data];

    // 监听对话框关闭后的回调
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.success) {
           row.loading = false;
           row.success = true;
           this.dataSource.data = [...this.dataSource.data];  // 强制刷新行
          
        } else {
          row.loading = false;
          row.success = false;
          this.dataSource.data = [...this.dataSource.data];  // 强制刷新行
        }
      }
    });
  }

  formatSize(value: number): string {
    if (value >= 1_073_741_824) {
      return (value / 1_073_741_824).toFixed(2) + ' GB';
    } else if (value >= 1_048_576) {
      return (value / 1_048_576).toFixed(2) + ' MB';
    } else if (value >= 1024) {
      return (value / 1024).toFixed(2) + ' KB';
    } else {
      return value + ' bytes';
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);  // 直接使用传入的 ISO 格式日期字符串
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);  // 月份从0开始，+1
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
  
    return `${year}-${month}-${day}`;  // 格式化为 yyyy-MM-dd HH:mm:ss
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}