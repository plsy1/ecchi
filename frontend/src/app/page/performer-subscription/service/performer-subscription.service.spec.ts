import { TestBed } from '@angular/core/testing';

import { PerformerSubscriptionService } from './performer-subscription.service';

describe('PerformerSubscriptionService', () => {
  let service: PerformerSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformerSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
