import { Component } from '@angular/core';
import { SidebarComponent } from "./component/sidebar/sidebar.component";
import { TopbarComponent } from "./component/topbar/topbar.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, DashboardComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
