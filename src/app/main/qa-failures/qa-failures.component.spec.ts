import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { QafailuresComponent } from './qa-failures.component';
import { QaFailuresComponent } from './qa-failures.component';

describe('QafailuresComponent', () => {
  let component: QaFailuresComponent;
  let fixture: ComponentFixture<QaFailuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaFailuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaFailuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
