import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlayerPage } from './event-player.page';

describe('EventPlayerPage', () => {
  let component: EventPlayerPage;
  let fixture: ComponentFixture<EventPlayerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPlayerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
