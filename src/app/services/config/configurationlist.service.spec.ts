import { TestBed } from '@angular/core/testing';

import { ConfigurationlistService } from './configurationlist.service';

describe('ConfigurationlistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigurationlistService = TestBed.get(ConfigurationlistService);
    expect(service).toBeTruthy();
  });
});
