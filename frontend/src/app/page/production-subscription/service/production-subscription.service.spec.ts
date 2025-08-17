import { TestBed } from '@angular/core/testing';

import { ProductionSubscriptionService } from './production-subscription.service';

describe('ProductionSubscriptionService', () => {
  let service: ProductionSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
