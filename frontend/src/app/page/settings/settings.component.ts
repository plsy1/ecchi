import { Component } from '@angular/core';
import { EnvironmentVariableComponent } from "./component/environment-variable/environment-variable.component";
import { ChangePasswordComponent } from "./component/change-password/change-password.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [EnvironmentVariableComponent, ChangePasswordComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
