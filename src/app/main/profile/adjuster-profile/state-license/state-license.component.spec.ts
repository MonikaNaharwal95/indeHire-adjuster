import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateLicenseComponent } from './state-license.component';

describe('StateLicenseComponent', () => {
  let component: StateLicenseComponent;
  let fixture: ComponentFixture<StateLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
