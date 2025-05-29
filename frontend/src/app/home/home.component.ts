import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { ApiService } from '../api.service';
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

import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  searchResults: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  query: string = '';
  displayedColumns: string[] = [
    'indexer',
    'title',
    'size',
    'seeders',
    'publishDate',
  ];
  dataSource = new MatTableDataSource<any>(this.searchResults);

  dialog: MatDialog = inject(MatDialog);

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private homeService: ApiService) {}

  ngOnInit(): void {
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

  async search(query: string): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      await this.homeService.search(query);
      this.loading = false;
    } catch (err) {
      this.error = '加载失败，请稍后再试';
      this.loading = false;
    }
  }

  onSearchChange(): void {
    if (this.query.trim()) {
      this.search(this.query);
    } else {
      this.dataSource.data = [];
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
        downloadUrl: downloadUrl,
      },
    });

    this.dataSource.data = [...this.dataSource.data];

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.success) {
          row.loading = false;
          row.success = true;
          this.dataSource.data = [...this.dataSource.data];
        } else {
          row.loading = false;
          row.success = false;
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }

    onTitleClick(row: any): void {
      const url = row.infoUrl;
        if (url) {
    window.open(url, '_blank'); // 在新标签页打开
  }
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
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
