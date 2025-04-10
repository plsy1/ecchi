import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

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
    MatAutocompleteModule,
    MatOptionModule,
  ],
})
export class DownloadOptionComponent {
  downloadUrl: string;
  savePathOptions: string[] = [];
  savePath: string = '';
  filteredOptions: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<DownloadOptionComponent>,
    private snackBar: MatSnackBar,
    private homeService: ApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { downloadUrl: string }
  ) {
    this.downloadUrl = data.downloadUrl;
    this.filteredOptions = this.savePathOptions;
  }

  ngOnInit(): void {
    const savedPaths = localStorage.getItem('savePathOptions');
    if (savedPaths) {
      this.savePathOptions = JSON.parse(savedPaths);
      this.filteredOptions = [...this.savePathOptions];
    }
  }

  async download(): Promise<void> {
    try {
      this.snackBar.open('Sending......', 'Close', { duration: 2000 });
      const results = await this.homeService.pushTorrent(
        this.homeService.queryKeywords,
        this.homeService.movieLink,
        this.downloadUrl,
        this.savePath,
        ''
      );
      console.log(this.savePath);

      if (this.savePath && !this.savePathOptions.includes(this.savePath)) {
        this.savePathOptions.push(this.savePath);

        localStorage.setItem(
          'savePathOptions',
          JSON.stringify(this.savePathOptions)
        );

        this.filteredOptions = [...this.savePathOptions];
      }

      this.dialogRef.close({
        success: true,
        message: 'Download started successfully!',
      });
    } catch (error) {
      console.error('Sent failed:', error);

      this.dialogRef.close({
        success: false,
        message: 'Search failed. Please try again.',
      });
      this.snackBar.open('Search failed. Please try again.', 'Close', {
        duration: 2000,
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  showErrorNotification(message: string) {
    this.snackBar.open(message, '关闭', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
