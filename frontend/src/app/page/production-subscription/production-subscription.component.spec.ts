import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSubscriptionComponent } from './production-subscription.component';

describe('ProductionSubscriptionComponent', () => {
  let component: ProductionSubscriptionComponent;
  let fixture: ComponentFixture<ProductionSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
