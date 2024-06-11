import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAlertsComponent } from './notification-alerts.component';

describe('NotificationAlertsComponent', () => {
  let component: NotificationAlertsComponent;
  let fixture: ComponentFixture<NotificationAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
