import { TestBed } from '@angular/core/testing';

import { IronsourceService } from './ironsource.service';

describe('IronsourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IronsourceService = TestBed.get(IronsourceService);
    expect(service).toBeTruthy();
  });
});
