import { Component } from '@angular/core';
import { EnvironmentVariableComponent } from "./components/environment-variable/environment-variable.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { BackgroundTasksComponent } from './components/background-tasks/background-tasks.component';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [EnvironmentVariableComponent, ChangePasswordComponent, BackgroundTasksComponent, MatTabsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

    selectedTabIndex = 0;

  ngOnInit() {
    const savedIndex = sessionStorage.getItem('settingsTabIndex');
    if (savedIndex !== null) {
      this.selectedTabIndex = +savedIndex;
    }
  }

  onTabChange(event: any) {
    sessionStorage.setItem('settingsTabIndex', event.index);
  }

}
