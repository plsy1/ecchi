import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from './api.service';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TorrentSearcher';
  isSidebarOpen = true;
  searchTerm = '';
  searchResults: any[] = [];
  isLoginPage: boolean = false;

  dialog: MatDialog = inject(MatDialog);

  constructor(private homeService: HomeService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  async performSearch() {
    console.log('Search term:', this.searchTerm);
    if (this.searchTerm) {
      try {
        const results = await this.homeService.search(this.searchTerm);
        console.log('Search results:', results);
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  }

  OpenSearch() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {});
  }

  logout(): void {
    this.homeService.logout();
  }
}
