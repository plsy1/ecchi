import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActressFeedListComponent } from './actress-feed-list.component';

describe('ActressFeedListComponent', () => {
  let component: ActressFeedListComponent;
  let fixture: ComponentFixture<ActressFeedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActressFeedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActressFeedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
