import { TestBed } from '@angular/core/testing';

import { CourtCaseService } from './court-case.service';

describe('CourtCaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourtCaseService = TestBed.get(CourtCaseService);
    expect(service).toBeTruthy();
  });
});
