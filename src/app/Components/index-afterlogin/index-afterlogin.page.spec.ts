import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAfterloginPage } from './index-afterlogin.page';

describe('IndexAfterloginPage', () => {
  let component: IndexAfterloginPage;
  let fixture: ComponentFixture<IndexAfterloginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexAfterloginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexAfterloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
