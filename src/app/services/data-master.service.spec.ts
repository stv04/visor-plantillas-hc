import { TestBed } from '@angular/core/testing';

import { DataMasterService } from './data-master.service';

describe('DataMasterService', () => {
  let service: DataMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
