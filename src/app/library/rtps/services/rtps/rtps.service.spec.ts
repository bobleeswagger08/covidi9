import { TestBed } from '@angular/core/testing';

import { RtpsService } from './rtps.service';

describe('RtpsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RtpsService = TestBed.get(RtpsService);
    expect(service).toBeTruthy();
  });
});
