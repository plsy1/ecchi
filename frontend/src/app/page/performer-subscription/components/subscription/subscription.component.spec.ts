import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformerSubscriptionListComponent } from './subscription.component';

describe('ActressFeedListComponent', () => {
  let component: PerformerSubscriptionListComponent;
  let fixture: ComponentFixture<PerformerSubscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformerSubscriptionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformerSubscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
