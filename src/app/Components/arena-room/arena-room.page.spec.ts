import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaRoomPage } from './arena-room.page';

describe('ArenaRoomPage', () => {
  let component: ArenaRoomPage;
  let fixture: ComponentFixture<ArenaRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArenaRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
