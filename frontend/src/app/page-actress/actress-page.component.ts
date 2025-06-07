import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { MovieCards } from '../card-movies/movie-cards.component';
import { ActressInformationComponent } from '../card-actress-information/actress-information.component';

@Component({
  selector: 'app-actress-page',
  standalone: true,
  imports: [CommonModule, MovieCards, ActressInformationComponent],
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
