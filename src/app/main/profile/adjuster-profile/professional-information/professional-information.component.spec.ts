import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalInformationComponent } from './professional-information.component';

describe('ProfessionalInformationComponent', () => {
  let component: ProfessionalInformationComponent;
  let fixture: ComponentFixture<ProfessionalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
