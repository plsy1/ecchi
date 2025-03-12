import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieinformationComponent } from './movieinformation.component';

describe('MovieinformationComponent', () => {
  let component: MovieinformationComponent;
  let fixture: ComponentFixture<MovieinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieinformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
