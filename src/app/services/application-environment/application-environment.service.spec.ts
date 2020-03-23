import { TestBed } from '@angular/core/testing';

import { ApplicationEnvironmentService } from './application-environment.service';

describe('SystemEnvironmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationEnvironmentService = TestBed.get(ApplicationEnvironmentService);
    expect(service).toBeTruthy();
  });
});
