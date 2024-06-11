import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestUpdateComponent } from './latest-update.component';

describe('LatestUpdateComponent', () => {
  let component: LatestUpdateComponent;
  let fixture: ComponentFixture<LatestUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
