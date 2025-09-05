import { Component, OnInit } from '@angular/core';
import { PageExploreServiceService } from '../../services/page-explore.service';
import { JavtrailersDailyRelease } from '../../models/page-explore';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-javtrailers',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './javtrailers.component.html',
  styleUrls: ['./javtrailers.component.css'],
})
export class JavtrailersComponent implements OnInit {
  releaseData: JavtrailersDailyRelease | null = null;

  constructor(
    private router: Router,
    private pageExploreService: PageExploreServiceService
  ) {}

  ngOnInit() {
    const today = new Date();
    const yyyymmdd =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    this.pageExploreService.getJavtrailersReleaseByDate(yyyymmdd).subscribe({
      next: (data) => {
        this.releaseData = data;
      },
      error: (err) => {
        console.error('Error fetching daily release:', err);
      },
      complete: () => {
        console.log('Fetch daily release completed');
      },
    });
  }

  // async posterClick(contentId: string) {
  //   try {
  //     this.router.navigate(['keywords', contentId]);
  //   } catch (error) {
  //     console.error('Failed:', error);
  //   }
  // }
  posterClick(contentId: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['keywords', contentId])
    );
    window.open(url, '_blank');
  }
}
