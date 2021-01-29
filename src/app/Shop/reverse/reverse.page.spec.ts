import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversePage } from './reverse.page';

describe('ReversePage', () => {
  let component: ReversePage;
  let fixture: ComponentFixture<ReversePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReversePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
