import { TestBed } from '@angular/core/testing';

import { PageExploreServiceService } from './page-explore-service.service';

describe('PageExploreServiceService', () => {
  let service: PageExploreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageExploreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
