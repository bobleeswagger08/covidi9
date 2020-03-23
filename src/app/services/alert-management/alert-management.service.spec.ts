import { TestBed } from '@angular/core/testing';

import { AlertManagementService } from './alert-management.service';

describe('AlertManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertManagementService = TestBed.get(AlertManagementService);
    expect(service).toBeTruthy();
  });
});
