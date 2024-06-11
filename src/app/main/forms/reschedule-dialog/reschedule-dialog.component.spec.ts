import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

import { RescheduleDialogComponent } from './reschedule-dialog.component';

class BypassService {
  showDialog(): Observable<any> {
    return of([]);
  }
  saveClicked(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
}

describe('RescheduleDialogComponent', () => {
  let component: RescheduleDialogComponent;
  let fixture: ComponentFixture<RescheduleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ RescheduleDialogComponent, DialogComponent ],
      providers: [BypassService],
      schemas: [NO_ERRORS_SCHEMA],
    }); 
    TestBed.overrideComponent(RescheduleDialogComponent, {
      set: {
        providers: [
          { provide: AdjusterService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: DialogService, useClass: BypassService}
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    const dialogRef = spyOn(component.dialogRef, 'showDialog');
    component.showDialog();
    expect(dialogRef).toHaveBeenCalled();
  });

  it('should close  dialog ', () => {
    const dialogRef = spyOn(component.dialogRef, 'hideDialog');
    component.hideDialog();
    expect(dialogRef).toHaveBeenCalled();
  });
  it('should save data', () => {
    expect(component.saveClicked());
  });
});
