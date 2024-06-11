import { CmsService } from './../../services/cms.service';
import { Component, OnInit } from '@angular/core';
import { GridColumn } from 'src/app/shared/grid/grid.model';
import { QaFailures } from 'src/app/models/home-page.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { ReportApiParams, AssignmentReportModel } from 'src/app/models/qa-failure.model';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookup.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { QaFailureMetadata } from 'src/app/models/qa-failure.metadata';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'inde-qa-failures',
  templateUrl: './qa-failures.component.html',
  styleUrls: ['./qa-failures.component.scss']
})
export class QaFailuresComponent implements OnInit {

  public loader: boolean = true;
  public submitted: QaFailures[] = [];
  public qaSubmitedColumn: GridColumn[] = [];
  public qaFailedColumn: GridColumn[] = [];
  public qaApprovedColumn: GridColumn [] = [];
  public selectedNav: number = 1;
  public navStatus: string;
  public filterForm: FormGroup;
  public formSubscription: Subscription;
  public apiSubscription: Subscription;
  public gridLoader: boolean;
  public assignmentReport: AssignmentReportModel[];
  public qaFailureMetadata: QaFailureMetadata;

  constructor(
    private formBuilder: FormBuilder,
    private adjusterService: AdjusterService,
    private cmsService: CmsService,
    private actRoute: ActivatedRoute
  ) { }

  get filterKeys(): FormKeysModel {
    return this.filterForm.controls;
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  private getQaFailureMetadata(): void {
    this.cmsService.getMetadata<QaFailureMetadata>('IH_Adjuster_QaFailure')
    .subscribe((qaData: QaFailureMetadata) => {
      if (qaData) {
        this.qaFailureMetadata = qaData;
        this.getAssignmentReport();
      }
    });
  }

  public buildForm(): void {
    this.filterForm = this.formBuilder.group({
      statusTypeID: new FormControl('ARSB'),
      postalCode: new FormControl(null, { updateOn: 'blur' }),
      requirementTypeID: new FormControl([]),
      searchKey: new FormControl(''),
      carrierID: new FormControl([])
    });
    const navRoute = this.actRoute.snapshot.queryParams.nav;
    if (navRoute && navRoute > 0 && navRoute < 4) {
      this.selectedNav = +navRoute;
      this.handleNavbar();
    }
    this.formSubscription = this.filterForm.valueChanges.subscribe(
      (change: ReportApiParams) => {
        this.getAssignmentReport();
      }
    );
    this.getQaFailureMetadata();
  }

  // private getClientLookup(): Promise<LookupModel[]> {
  //   return new Promise((resolve: Function, reject: Function): void => {
  //     this.lookupService.getRequirementType().subscribe((lookupRes: LookupModel[]) => {
  //       if (lookupRes) {
  //         this.requirementLookup = lookupRes;
  //         resolve(lookupRes);
  //       }
  //       reject('api failed');
  //     });
  //   });
  // }

  public getAssignmentReport(): void {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    this.gridLoader = true;
    this.apiSubscription = this.adjusterService.getAssignmentReport(this.filterForm.value).subscribe(
      (reportData: AssignmentReportModel[]) => {
        if (reportData) {
          this.assignmentReport = reportData;
          this.qaFailedGridColumn();
          this.assignmentReport.forEach((item: AssignmentReportModel) => {
            item.modifiedDate = item.modifiedDate ? new Date(item.modifiedDate.slice(0, 10)).toLocaleDateString('en-US') : '';
          });
          this.gridLoader = false;
        }
      }
    );
  }

  // columns for QA Failed
  private qaFailedGridColumn(): void {
    this.qaFailedColumn = [
      new GridColumn(
        'assignmentReferenceNo',
        this.qaFailureMetadata.IH_Adj_QaFail_AsgmtID, {
        }
      ),
      new GridColumn(
        'requirementTypeID',
        this.qaFailureMetadata.IH_Adj_QaFail_Reqmt,
      ),
      new GridColumn(
        'modifiedDate',
        this.qaFailureMetadata.IH_Adj_QaFail_SubmittedDate, {
          hidden: this.selectedNav !== 1
        }
      ),
      new GridColumn(
        'modifiedDate',
        this.qaFailureMetadata.IH_Adj_QaFail_ReviewedOn, {
          hidden: this.selectedNav === 1
        }
      ),
      new GridColumn(
        'modifiedBy',
        this.qaFailureMetadata.IH_Adj_QaFail_ReviewedBy, {
          hidden: this.selectedNav === 1
        }
      ),
      new GridColumn(
        'statusReason',
        this.qaFailureMetadata.IH_Adj_QaFail_Reason, {
          hidden: this.selectedNav !== 2
        }
      ),
    ];
  }

  public handleNavbar(): void {
    if (this.selectedNav === 1) {
      this.filterKeys.statusTypeID.setValue('ARSB');
    } else if (this.selectedNav === 2) {
      this.filterKeys.statusTypeID.setValue('ARCR,ARSJ');
    } else if (this.selectedNav === 3) {
      this.filterKeys.statusTypeID.setValue('ARCA');
    }
  }

  public clearFilters(): void {
    this.filterKeys.postalCode.setValue(null);
    this.filterKeys.requirementTypeID.setValue([]);
  }

}
