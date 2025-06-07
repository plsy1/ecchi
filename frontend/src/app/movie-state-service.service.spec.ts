import { TestBed } from '@angular/core/testing';

import { MovieStateServiceService } from './movie-state-service.service';

describe('MovieStateServiceService', () => {
  let service: MovieStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
