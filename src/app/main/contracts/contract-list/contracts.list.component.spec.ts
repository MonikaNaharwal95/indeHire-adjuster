import { RescheduleDialogComponent } from "src/app/main/forms/reschedule-dialog/reschedule-dialog.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { Observable, of } from "rxjs";
import { AdjusterService } from "src/app/services/adjuster.service";
import { DialogService } from "src/app/services/dialog.service";
import { ValidatorService } from "src/app/services/validator.service";
import { DialogComponent } from "src/app/shared/dialog/dialog.component";
import { Router } from "@angular/router";
import { ContractListComponent } from "./contracts.list.component";

class BypassService {
  getContracts(): Observable<any> {
    return of([]);
  }
  postDismissClick(): Observable<any> {
    return of([]);
  }
}

fdescribe("ContractListComponent", () => {
  let component: ContractListComponent;
  let fixture: ComponentFixture<ContractListComponent>;
  const childRescheduleDialog = jasmine.createSpyObj(
    "RescheduleDialogComponent",
    ["hideDialog"]
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        DropDownsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [ContractListComponent, DialogComponent],
      providers: [BypassService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.overrideComponent(ContractListComponent, {
      set: {
        providers: [
          { provide: AdjusterService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: DialogService, useClass: BypassService },
          // { provide: Router, useClass: BypassService}
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should open Reschedule Dialog", () => {
    spyOn(component, "rescheduleClick").and.callThrough();
    component.rescheduleClick("");
    expect(component.rescheduleClick).toHaveBeenCalled();
  });

  it("should clled actionButtonClick", () => {
    const ID: number = 1;
    const jobID: string = "abc";
    spyOn(component, "actionButtonClick").and.callThrough();
    component.actionButtonClick(ID, jobID);
    expect(component.actionButtonClick).toHaveBeenCalled();
  });

  it('should called postDismissClick', () => {
    const jobID: number = 1;
    spyOn(component, "postDismissClick").and.callThrough();
    component.postDismissClick(jobID);
    expect(component.postDismissClick).toHaveBeenCalled();
  });

  it("should close addRescheduleDialog dialog", () => {
    component.openIndeRescheduleDialog = childRescheduleDialog;
    component.closeRescheduleDialog();
    expect(childRescheduleDialog.hideDialog).toHaveBeenCalled();
  });
  it("should close addRescheduleDialog dialog", () => {
    component.openIndeRescheduleDialog = childRescheduleDialog;
    component.rescheduleUser();
    expect(childRescheduleDialog.hideDialog).toHaveBeenCalled();
  });
});
