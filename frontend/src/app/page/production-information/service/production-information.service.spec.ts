import { TestBed } from '@angular/core/testing';

import { ProductionInformationService } from './production-information.service';

describe('ProductionInformationService', () => {
  let service: ProductionInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
