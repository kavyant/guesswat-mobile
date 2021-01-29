import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NinetySecondBeforeplayPage } from './ninety-second-beforeplay.page';

describe('NinetySecondBeforeplayPage', () => {
  let component: NinetySecondBeforeplayPage;
  let fixture: ComponentFixture<NinetySecondBeforeplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NinetySecondBeforeplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NinetySecondBeforeplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
