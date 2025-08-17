import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformerSubscriptionComponent } from './performer-subscription.component';

describe('PerformerSubscriptionComponent', () => {
  let component: PerformerSubscriptionComponent;
  let fixture: ComponentFixture<PerformerSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformerSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformerSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
