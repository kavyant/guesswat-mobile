import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchphrasePreplayPage } from './catchphrase-preplay.page';

describe('CatchphrasePreplayPage', () => {
  let component: CatchphrasePreplayPage;
  let fixture: ComponentFixture<CatchphrasePreplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchphrasePreplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchphrasePreplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
