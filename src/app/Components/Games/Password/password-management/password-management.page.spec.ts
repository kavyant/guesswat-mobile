import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagementPage } from './password-management.page';

describe('PasswordManagementPage', () => {
  let component: PasswordManagementPage;
  let fixture: ComponentFixture<PasswordManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
