import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintsShopPage } from './hints-shop.page';

describe('HintsShopPage', () => {
  let component: HintsShopPage;
  let fixture: ComponentFixture<HintsShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintsShopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintsShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
