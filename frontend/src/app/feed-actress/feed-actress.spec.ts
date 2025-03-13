import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindComponent } from './feed-actress';

describe('FindComponent', () => {
  let component: FindComponent;
  let fixture: ComponentFixture<FindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
