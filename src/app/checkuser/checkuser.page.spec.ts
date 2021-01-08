import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckuserPage } from './checkuser.page';

describe('CheckuserPage', () => {
  let component: CheckuserPage;
  let fixture: ComponentFixture<CheckuserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckuserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
