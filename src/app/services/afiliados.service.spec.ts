import { TestBed } from '@angular/core/testing';

import { AfiliadosService } from './afiliados.service';

describe('AfiliadosService', () => {
  let service: AfiliadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfiliadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
