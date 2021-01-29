import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NinetySecondChallengePage } from './ninety-second-challenge.page';

describe('NinetySecondChallengePage', () => {
  let component: NinetySecondChallengePage;
  let fixture: ComponentFixture<NinetySecondChallengePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NinetySecondChallengePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NinetySecondChallengePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
