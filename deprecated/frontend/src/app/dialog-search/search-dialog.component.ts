import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiService } from '../api.service';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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
    CommonModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule
  ],
})
export class SearchDialogComponent {
  searchType: string = '';
  searchKeywords: string = '';
  searchKeywordsOptions: string[] = [];
  filteredOptions: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent>,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; type: string }
  ) {
    this.filteredOptions = this.searchKeywordsOptions;
  }

  ngOnInit(): void {
    const savedPaths = localStorage.getItem('searchKeywordsOptions');
    if (savedPaths) {
      this.searchKeywordsOptions = JSON.parse(savedPaths);
      this.filteredOptions = [...this.searchKeywordsOptions];
    }
  }

  async search(): Promise<void> {
    if (this.searchType === '1') {
      try {
        this.snackBar.open('Searching......', 'Close', { duration: 2000 });
        const results = await this.apiService.search(this.searchKeywords);
        if (
          this.searchKeywords &&
          !this.searchKeywordsOptions.includes(this.searchKeywords)
        ) {
          this.searchKeywordsOptions.push(this.searchKeywords);

          localStorage.setItem(
            'searchKeywordsOptions',
            JSON.stringify(this.searchKeywordsOptions)
          );

          this.filteredOptions = [...this.searchKeywordsOptions];
        }

        this.router.navigate(['/torrents']);
        this.dialogRef.close();
      } catch (error) {
        this.snackBar.open('Failed. Please try again.', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      }
    } else if (this.searchType === '2') {
      try {
        this.snackBar.open('Searching......', 'Close', { duration: 2000 });
        this.apiService.queryKeywords = this.searchKeywords
        this.apiService.discoverType = 2;
        if (
          this.searchKeywords &&
          !this.searchKeywordsOptions.includes(this.searchKeywords)
        ) {
          this.searchKeywordsOptions.push(this.searchKeywords);

          localStorage.setItem(
            'searchKeywordsOptions',
            JSON.stringify(this.searchKeywordsOptions)
          );

          this.filteredOptions = [...this.searchKeywordsOptions];
        }

        this.router.navigate([`/actress/${this.searchKeywords}`]);
        this.dialogRef.close();
      } catch (error) {
        this.snackBar.open('Failed. Please try again.', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      }
    } 
    
    else if (this.searchType === '3') {
      try {
        this.snackBar.open('Searching......', 'Close', { duration: 2000 });
        this.apiService.queryKeywords = this.searchKeywords;
        this.apiService.discoverType = 1;

        if (
          this.searchKeywords &&
          !this.searchKeywordsOptions.includes(this.searchKeywords)
        ) {
          this.searchKeywordsOptions.push(this.searchKeywords);

          localStorage.setItem(
            'searchKeywordsOptions',
            JSON.stringify(this.searchKeywordsOptions)
          );

          this.filteredOptions = [...this.searchKeywordsOptions];
        }

        this.router.navigate(['/search',this.searchKeywords]);
        this.dialogRef.close();
      } catch (error) {
        this.snackBar.open('Failed. Please try again.', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  showErrorNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  
}
