import { CommonService } from './../../common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DownloadOptionComponent } from './component/download-option/download-option.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FileSizePipe } from '../../pipe/file-size.pipe';
import { DateFormatPipe } from '../../pipe/date-format.pipe';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-torrent-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    FileSizePipe,
    DateFormatPipe,
  ],
  templateUrl: './torrent-list.component.html',
  styleUrl: './torrent-list.component.css',
})
export class TorrentListComponent implements OnInit, AfterViewInit {
  searchResults: any[] = [];
  query: string = '';
  dataSource = new MatTableDataSource<any>(this.searchResults);
  dialog: MatDialog = inject(MatDialog);
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = [
    'indexer',
    'title',
    'size',
    'seeders',
    'publishDate',
  ];

  constructor(private common: CommonService) {}

  ngOnInit(): void {
    this.common.torrentSearchResults$.subscribe((results) => {
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.sort) {
        this.dataSource.sort = this.sort;
        this.sort.active = 'seeders';
        this.sort.direction = 'desc';
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onTitleClick(row: any): void {
    const url = row.infoUrl;
    if (url) {
      window.open(url, '_blank');
    }
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
}
