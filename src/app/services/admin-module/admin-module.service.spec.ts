import { TestBed } from '@angular/core/testing';

import { SystemAdminService } from './system-admin.service';

describe('SystemAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemAdminService = TestBed.get(SystemAdminService);
    expect(service).toBeTruthy();
  });
});
