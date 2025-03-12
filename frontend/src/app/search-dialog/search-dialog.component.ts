import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 导入 Router 和 RouterModule

import { HomeService } from '../api.service'; // Import the HomeService

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    CommonModule
    
  ]
})
export class SearchDialogComponent {
  searchType: string = '';
  searchKeywords: string = '';

  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent>, 
    private snackBar: MatSnackBar,
    private homeService: HomeService,  // Inject HomeService
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; type: string }
  ) 
    {
      
    }
  
    async search(): Promise<void> {
      if (this.searchType === '1') {
        try {
          // 调用 HomeService 进行搜索
          this.snackBar.open('Searching......', 'Close', { duration: 2000 });
          const results = await this.homeService.search(this.searchKeywords);
          // 搜索成功后关闭对话框
          this.router.navigate(['/']);
          this.dialogRef.close();  
        } catch (error) {
          // 搜索失败时输出错误并显示 Snackbar 提示
          console.error('Search failed:', error);
          this.snackBar.open('Search failed. Please try again.', 'Close', { duration: 2000 });
          this.dialogRef.close();
        }
      }
      else if (this.searchType === '2') {
        try {
          // 调用 HomeService 进行按编号的搜索
          this.snackBar.open('Searching......', 'Close', { duration: 2000 });
          const results = await this.homeService.discoverByActress(this.searchKeywords,1);
          console.log('Search results (Type 2):', results);
          this.homeService.currentPage = 1;
          this.router.navigate([`/actress/${this.searchKeywords}`]);
          this.dialogRef.close();  
        } catch (error) {
          // 搜索失败时输出错误并显示 Snackbar 提示
          console.error('Search failed:', error);
          this.snackBar.open('Search failed. Please try again.', 'Close', { duration: 2000 });
          this.dialogRef.close();
        }
      }

      else if (this.searchType === '3') {
        try {
          // 调用 HomeService 进行按编号的搜索
          this.snackBar.open('Searching......', 'Close', { duration: 2000 });
          const results = await this.homeService.discoverByKeywords(this.searchKeywords,1);
          console.log('Search results (Type 3):', results);
          this.homeService.currentPage = 1;
          // 搜索成功后关闭对话框并跳转到根路由
          this.router.navigate(['/result']); // 执行路由跳转到根路由（/）
          this.dialogRef.close();  
        } catch (error) {
          // 搜索失败时输出错误并显示 Snackbar 提示
          console.error('Search failed:', error);
          this.snackBar.open('Search failed. Please try again.', 'Close', { duration: 2000 });
          this.dialogRef.close();
        }
      }
    }


  close() {
    this.dialogRef.close();
  }

  showErrorNotification(message: string) {
    this.snackBar.open(message, '关闭', {
      duration: 3000,
      panelClass: ['error-snackbar'] // Add custom styling if needed
    });
  }

}

