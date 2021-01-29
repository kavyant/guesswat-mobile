import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezoPage } from './freezo.page';

describe('FreezoPage', () => {
  let component: FreezoPage;
  let fixture: ComponentFixture<FreezoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
