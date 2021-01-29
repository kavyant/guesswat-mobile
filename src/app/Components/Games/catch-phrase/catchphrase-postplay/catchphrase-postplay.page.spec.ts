import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchphrasePostplayPage } from './catchphrase-postplay.page';

describe('CatchphrasePostplayPage', () => {
  let component: CatchphrasePostplayPage;
  let fixture: ComponentFixture<CatchphrasePostplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchphrasePostplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchphrasePostplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
