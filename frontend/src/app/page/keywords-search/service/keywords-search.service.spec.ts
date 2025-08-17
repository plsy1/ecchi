import { TestBed } from '@angular/core/testing';

import { KeywordsSearchService } from './keywords-search.service';

describe('KeywordsSearchService', () => {
  let service: KeywordsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeywordsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
