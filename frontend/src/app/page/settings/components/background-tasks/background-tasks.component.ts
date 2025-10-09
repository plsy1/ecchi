import { Component } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
@Component({
  selector: 'app-background-tasks',
  standalone: true,
  imports: [],
  templateUrl: './background-tasks.component.html',
  styleUrl: './background-tasks.component.css',
})
export class BackgroundTasksComponent {
  isRefreshing = false;
  constructor(private SettingsService: SettingsService) {}
  refreshFeeds() {
    this.isRefreshing = true;
    this.SettingsService.refreshKeywordsFeeds().subscribe({
      next: (res) => {
        console.log(res.message);

        this.isRefreshing = false;
      },
      error: (err) => {
        console.error('Refresh failed:', err);
        this.isRefreshing = false;
      },
    });
  }
}
