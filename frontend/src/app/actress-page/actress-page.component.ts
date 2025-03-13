import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SubComponent } from '../movies-search-results/movies-search-results.component';
import { ActressInformationComponent } from '../actress-information-card/actress-information.component';

@Component({
  selector: 'app-actress-page',
  standalone: true,
  imports: [CommonModule, SubComponent, ActressInformationComponent],
  templateUrl: './actress-page.component.html',
  styleUrl: './actress-page.component.css',
})
export class ActressPageComponent {
  name: string = '';

  constructor(
    private getRoute: ActivatedRoute,
    private homeService: ApiService
  ) {}

  ngOnInit(): void {
    this.getRoute.paramMap.subscribe((params) => {
      this.name = params.get('name') || '';
      this.homeService.discoverByActress(this.name, 1);
    });
  }
}
