import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjusterProfileComponent } from './adjuster-profile.component';

describe('AdjusterProfileComponent', () => {
  let component: AdjusterProfileComponent;
  let fixture: ComponentFixture<AdjusterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjusterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjusterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
