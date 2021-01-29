import { TestBed } from '@angular/core/testing';

import { NegAuthGuardService } from './neg-auth-guard.service';

describe('NegAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NegAuthGuardService = TestBed.get(NegAuthGuardService);
    expect(service).toBeTruthy();
  });
});
