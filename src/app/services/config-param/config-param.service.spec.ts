import { TestBed } from '@angular/core/testing';

import { ConfigParamService } from './config-param.service';

describe('SystemConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigParamService = TestBed.get(ConfigParamService);
    expect(service).toBeTruthy();
  });
}); 
