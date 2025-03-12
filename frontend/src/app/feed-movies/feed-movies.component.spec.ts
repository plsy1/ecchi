import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedMoviesComponent } from './feed-movies.component';

describe('FeedMoviesComponent', () => {
  let component: FeedMoviesComponent;
  let fixture: ComponentFixture<FeedMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
