import { TestBed } from '@angular/core/testing';

import { PerformerService } from './performer.service';

describe('PerformerService', () => {
  let service: PerformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
