import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchphrasePlayPage } from './catchphrase-play.page';

describe('CatchphrasePlayPage', () => {
  let component: CatchphrasePlayPage;
  let fixture: ComponentFixture<CatchphrasePlayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchphrasePlayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchphrasePlayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
