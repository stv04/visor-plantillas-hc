import { TestBed } from '@angular/core/testing';

import { AfilConfigService } from './afil-config.service';

describe('AfilConfigService', () => {
  let service: AfilConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfilConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
