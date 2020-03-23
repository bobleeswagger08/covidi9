import { TestBed } from '@angular/core/testing';

import { CovidI9Service } from './covid-i9.service';

describe('CovidI9Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CovidI9Service = TestBed.get(CovidI9Service);
    expect(service).toBeTruthy();
  });
});
