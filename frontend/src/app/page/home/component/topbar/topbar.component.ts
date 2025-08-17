import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Location } from '@angular/common';
import { HomeService } from '../../service/home.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchOptionComponent } from '../search-option/search-option.component';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatSidenavModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  dialog: MatDialog = inject(MatDialog);
  constructor(private location: Location, private homeService: HomeService) {}

  toggleSidebar() {
    this.homeService.setSidebarOpen(!this.homeService.isSidebarOpen);
  }
  OpenSearch() {
    const dialogRef = this.dialog.open(SearchOptionComponent, {});
  }
  goBack() {
    this.location.back();
  }
}
