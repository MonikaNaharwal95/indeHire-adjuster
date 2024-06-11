import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingSytemComponent } from './mailing-sytem.component';

describe('MailingSytemComponent', () => {
  let component: MailingSytemComponent;
  let fixture: ComponentFixture<MailingSytemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingSytemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingSytemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
