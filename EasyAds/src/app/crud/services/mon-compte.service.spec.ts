import { TestBed } from '@angular/core/testing';

import { MonCompteService } from './mon-compte.service';

describe('MonCompteService', () => {
  let service: MonCompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonCompteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
