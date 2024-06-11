import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossOriginFallbackComponent } from './cross-origin-fallback.component';

describe('CrossOriginFallbackComponent', () => {
  let component: CrossOriginFallbackComponent;
  let fixture: ComponentFixture<CrossOriginFallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossOriginFallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossOriginFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
