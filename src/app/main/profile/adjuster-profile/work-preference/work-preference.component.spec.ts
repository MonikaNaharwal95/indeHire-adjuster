import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPreferenceComponent } from './work-preference.component';

describe('WorkPreferenceComponent', () => {
  let component: WorkPreferenceComponent;
  let fixture: ComponentFixture<WorkPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
