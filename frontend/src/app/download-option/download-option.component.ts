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
  selector: 'app-download-option',
  templateUrl: './download-option.component.html',
  styleUrl: './download-option.component.css',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
  ],
})
export class DownloadOptionComponent {
  downloadUrl: string;
  savePath: string = '/sdb/pt/beauty/jav';

  constructor(
    private dialogRef: MatDialogRef<DownloadOptionComponent>,
    private snackBar: MatSnackBar,
    private homeService: HomeService, // Inject HomeService
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { downloadUrl: string; }) 
    {
      this.downloadUrl = data.downloadUrl
    }
   

    async download(): Promise<void> {
      try {
        this.snackBar.open('Sending......', 'Close', { duration: 2000 });
        const results = await this.homeService.pushTorrent(this.homeService.queryKeywords,this.homeService.movieLink,this.downloadUrl, this.savePath, '');
        
        // 下载成功后返回一个成功的结果
        this.dialogRef.close({ success: true, message: 'Download started successfully!' });

      } catch (error) {
        console.error('Sent failed:', error);
        
        // 下载失败时返回失败结果
        this.dialogRef.close({ success: false, message: 'Search failed. Please try again.' });
        this.snackBar.open('Search failed. Please try again.', 'Close', { duration: 2000 });
      }
    }

  close() {
    this.dialogRef.close();
  }

  showErrorNotification(message: string) {
    this.snackBar.open(message, '关闭', {
      duration: 3000,
      panelClass: ['error-snackbar'], // Add custom styling if needed
    });
  }
}
