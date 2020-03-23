import { TestBed } from '@angular/core/testing';

import { NotifiSignalRService } from './notifi-signal-r.service';

describe('NotifiSignalRService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotifiSignalRService = TestBed.get(NotifiSignalRService);
    expect(service).toBeTruthy();
  });
});
