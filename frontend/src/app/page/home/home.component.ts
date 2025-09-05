import { SidebarComponent } from './component/sidebar/sidebar.component';
import { TopbarComponent } from './component/topbar/topbar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('dashboard') dashboard!: ElementRef<HTMLElement>;

  private scrollPositions: { [url: string]: number } = {};

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const el = this.dashboard.nativeElement;

    el.addEventListener('scroll', () => {
      const url = this.router.url;
      this.scrollPositions[url] = el.scrollTop;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const scrollTop = this.scrollPositions[url] || 0;

        setTimeout(() => {
          el.scrollTo({ top: scrollTop });
        });
      });
  }
}
