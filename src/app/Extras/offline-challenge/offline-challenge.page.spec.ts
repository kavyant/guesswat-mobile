import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineChallengePage } from './offline-challenge.page';

describe('OfflineChallengePage', () => {
  let component: OfflineChallengePage;
  let fixture: ComponentFixture<OfflineChallengePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineChallengePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineChallengePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
