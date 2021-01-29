import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBeforelogin2Page } from './index-beforelogin2.page';

describe('IndexBeforelogin2Page', () => {
  let component: IndexBeforelogin2Page;
  let fixture: ComponentFixture<IndexBeforelogin2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexBeforelogin2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexBeforelogin2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
