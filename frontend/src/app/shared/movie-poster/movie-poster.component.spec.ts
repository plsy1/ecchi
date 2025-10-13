import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviePosterComponent } from './movie-poster.component';

describe('MoviePosterComponent', () => {
  let component: MoviePosterComponent;
  let fixture: ComponentFixture<MoviePosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviePosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviePosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
