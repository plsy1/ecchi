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
  constructor(private SettingsService: SettingsService) {}
  refreshFeeds() {
    this.SettingsService.refreshKeywordsFeeds().subscribe({
      next: (res) => {
        console.log(res.message);
      },
      error: (err) => {
        console.error('Refresh failed:', err);
      },
    });
  }

  refreshEMBY() {
    this.SettingsService.refreshEMBY().subscribe({
      next: (res) => {
        console.log(res.message);
      },
      error: (err) => {
        console.error('Refresh failed:', err);
      },
    });
  }
}
