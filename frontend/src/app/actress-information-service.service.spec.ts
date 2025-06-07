import { TestBed } from '@angular/core/testing';

import { ActressInformationService } from './actress-information-service.service';

describe('ActressInformationServiceService', () => {
  let service: ActressInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActressInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
