import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { PageExploreServiceService } from '../../services/page-explore.service';
import { CommonModule } from '@angular/common';
import { AvbaseIndexData } from '../../models/page-explore';

@Component({
  selector: 'app-avbase',
  standalone: true,
  imports: [MatTabsModule, CommonModule],
  templateUrl: './avbase.component.html',
  styleUrl: './avbase.component.css',
})
export class AvbaseComponent implements OnInit {
  avbaseIndexData?: AvbaseIndexData;
  constructor(
    private PageExploreService: PageExploreServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAvbaseIndex();
  }

  loadAvbaseIndex(): void {
    this.PageExploreService.getAvbaseIndex().subscribe({
      next: (data) => {
        this.avbaseIndexData = data;
        console.log('Avbase index loaded:', data);
      },
      error: (err) => {
        console.error('Failed to load Avbase index:', err);
      },
    });
  }

  async cardClick(name: string) {
    try {
      this.router.navigate(['/performer', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }

  async posterClick(name: string) {
    try {
      this.router.navigate(['keywords', name]);
    } catch (error) {
      console.error('Failed:', error);
    }
  }
}
