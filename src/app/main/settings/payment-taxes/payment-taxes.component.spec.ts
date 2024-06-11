import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTaxesComponent } from './payment-taxes.component';

describe('PaymentTaxesComponent', () => {
  let component: PaymentTaxesComponent;
  let fixture: ComponentFixture<PaymentTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
