import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffloginPage } from './stafflogin.page';

describe('StaffloginPage', () => {
  let component: StaffloginPage;
  let fixture: ComponentFixture<StaffloginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffloginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
