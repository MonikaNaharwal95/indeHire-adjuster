import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
  Input,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { CmsService } from './../../services/cms.service';
import { GridColumn } from 'src/app/shared/grid/grid.model';
import { LookupService } from '../../services/lookup.service';
import { LookupModel } from '../../models/lookup.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { HomePageMetaData } from 'src/app/models/home-page.metadata';
import {
  GridIndexModel,
  MatchedJobsModel,
  ReceivedOffersModel,
  PendingTimeSheetModel,
  LatestUpdatesModel,
  HomePageResultModel,
  PostHomePagePosition,
  QaFailures,
  SechduleAppointment,
  AssignmentFinishDetail,
  AssignmentCancelationDetail,
  AssignmentStartingDetail,
  NewJobDetail,
  AlertNotification,
  RecentMessages,
  AssignmentDetail,
  DragEventModel,
} from 'src/app/models/home-page.model';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'inde-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit {
  @Input() date: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('name', { static: false }) name: TemplateRef<HTMLElement>;
  @ViewChild('rateamount', { static: false }) rateamount: TemplateRef<
    HTMLElement
  >;
  @ViewChild('offers', { static: false }) offers: TemplateRef<HTMLElement>;
  @ViewChild('startDate', { static: false }) startDate: TemplateRef<
    HTMLElement
  >;
  @ViewChild('location', { static: false }) location: TemplateRef<HTMLElement>;
  @ViewChild('contractReference', { static: false })
  contractReference: TemplateRef<HTMLElement>;
  @ViewChild('weekRange', { static: false }) weekRange: TemplateRef<
    HTMLElement
  >;
  @ViewChild('assignmentActionDate', { static: false })
  assignmentActionDate: TemplateRef<HTMLElement>;
  @ViewChild('jobDate', { static: false }) jobDate: TemplateRef<HTMLElement>;
  @ViewChild('reviewDate', { static: false }) reviewDate: TemplateRef<
    HTMLElement
  >;
  @ViewChild('appointmentDate', { static: false }) appointmentDate: TemplateRef<
    HTMLElement
  >;
  @ViewChild('assignedDate', { static: false }) assignedDate: TemplateRef<
    HTMLElement
  >;
  @ViewChild('dateandtime', { static: false }) dateandtime: TemplateRef<
    HTMLElement
  >;
  @ViewChild('startTime', { static: false }) startTime: TemplateRef<
    HTMLElement
  >;
  @ViewChild('address', { static: false }) address: TemplateRef<HTMLElement>;
  @ViewChild('terminatedReason', { static: false }) terminatedReason: TemplateRef<HTMLElement>;

  public stateLookup: LookupModel[] = [];
  public gridIndex: GridIndexModel[] = [];
  public matchedJobs: MatchedJobsModel;
  public receivedOffers: ReceivedOffersModel;
  public matchedColumns: GridColumn[];
  public pendingTimesheet: PendingTimeSheetModel;
  public timesheetColumns: GridColumn[];
  public receivedColumns: GridColumn[];
  public latestUpdates: LatestUpdatesModel;
  public metaData: HomePageMetaData;
  public loader: boolean = true;
  public value: Date;
  public dragEventModel: DragEventModel[] = [];
  public postIndexArray: PostHomePagePosition = {
    homePageTilesDetails: [],
  };
  public reasonLookup: LookupModel[] = [];
  public qaFaliures: QaFailures[] = [];
  public qaFailuresColumn: GridColumn[] = [];
  public appointment: SechduleAppointment[] = [];
  public SechduleAppointmentColumn: GridColumn[] = [];
  public assignmentCancelation: AssignmentCancelationDetail[] = [];
  public AssignmentCancelationDetailColumn: GridColumn[] = [];
  public newJob: NewJobDetail[] = [];
  public NewJobDetailColumn: GridColumn[] = [];
  public alert: AlertNotification[] = [];
  public AlertNotificationColumn: GridColumn[] = [];
  public recent: RecentMessages[] = [];
  public RecentMessagesColumn: GridColumn[] = [];
  public calender: AssignmentDetail[] = [];
  public AssignmentDetailColumn: GridColumn[] = [];
  public updateDateValue: Date;
  public time: string;
  public filteredCalendar: AssignmentDetail[] = [];
  public maxstartDate: Date;
  public minstartDate: Date;
  public highLightRecord: AssignmentDetail[] = [];
  constructor(
    private adjusterService: AdjusterService,
    private lookupService: LookupService,
    private router: Router,
    private cmsService: CmsService,
    private validatorService: ValidatorService,
    public dialogService: DialogService
  ) {}
  public ngOnInit(): void {
    this.getHomePage();
    this.getMetaData();
    this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {
      this.stateLookup = data;
    });
    this.getReasonLookupData();
    this.updateDateValue = new Date();
    this.minstartDate = this.validatorService.setDate(0);
    this.maxstartDate = this.validatorService.setDate(30);
  }

  public dateChangeValue(value: Date): void {
    this.updateDateValue = value;
    this.filteredCalendar = this.calender.filter(
      (item: AssignmentDetail) =>
        new Date(item.assignmentActionDate).setHours(0, 0, 0, 0) ===
        new Date(this.updateDateValue).setHours(0, 0, 0, 0)
    );
  }

  // This Function will Get the home page data .
  public getHomePage(): void {
    this.adjusterService
      .getHomeData()
      .subscribe((defaultData: HomePageResultModel) => {
        if (defaultData) {
          this.getMetaData()
            .then((res: HomePageMetaData) => {
              this.gridIndex = defaultData.homePageTilesDetails;
              this.latestUpdates = defaultData.latestUpdateDetails;

              this.matchedJobs = defaultData.matchedJobDetails;
              this.matchedGridColumns();
              this.loader = false;

              this.qaFaliures = defaultData.qaFailureDetails;
              this.qaFailuresGridColumn();

              this.appointment = defaultData.appointmentDetails;
              this.appointmentGridColumn();

              this.assignmentCancelation =
              defaultData.assignmentsCancelledDetails;
              this.assignmentCancelationGridColumn();
              this.assignmentCancelation.forEach((item: AssignmentCancelationDetail) => {
                item.statusReasonTypeName = this.getValueByKey(
                  item.statusReasonTypeID,
                  this.reasonLookup
                );
              });
              this.newJob = defaultData.newJobDetails;
              this.newJobGridColumn();
              this.alert = defaultData.alertsNotificationsDetails;
              this.alertNotificationGridColumn();

              this.recent = defaultData.recentMessagesEmailsDetails;
              this.recentMessageGridColumn();

              this.calender = defaultData.calenderDetails;
              this.dateChangeValue(this.updateDateValue);
              this.highLightRecord = this.calender;
              this.AssignmentGridColumn();
            })
            .catch((err: string) => {
              this.loader = false;
            });
        }
      });
  }


  public getReasonLookupData(): Promise<LookupModel[]> {
    return new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getAssignmentTermination().subscribe(
        (data: LookupModel[]) => {
          if (data) {
            this.reasonLookup = data;
            resolve(data);
          }
          reject('No Lookup data available');
        });
    });
  }

  // Calender section Grid

  private AssignmentGridColumn(): void {
    this.AssignmentDetailColumn = [
      new GridColumn('startTime', this.metaData.IH_AdjLanding_Time, {
        cellTemplate: this.startTime,
        width: 60,
      }),
      new GridColumn('assignmentReferenceNo', this.metaData.IH_AdjLanding_AsgmtRefNo, {
        width: 70,
      }),
      new GridColumn('clientName', this.metaData.IH_AdjLanding_Client, {
        width: 70,
      }),
      new GridColumn('location', this.metaData.IH_AdjLanding_Location, {
        cellTemplate: this.location,
        width: 70,
      }),
    ];
  }

  // Recent messages Grid

  private recentMessageGridColumn(): void {
    this.RecentMessagesColumn = [
      new GridColumn('dateandtime', this.metaData.IH_AdjLanding_DateTime, {
        cellTemplate: this.dateandtime,
        width: 100,
      }),
      new GridColumn('sender', this.metaData.IH_AdjLanding_Sender, {
        width: 90,
      }),
      new GridColumn('subject', this.metaData.IH_AdjLanding_Subject, {
        width: 90,
      }),
    ];
  }

  // Alert and notifications Grid

  private alertNotificationGridColumn(): void {
    this.AlertNotificationColumn = [
      new GridColumn(
        'notificationID',
        this.metaData.IH_AdjLanding_NotificationID,
        {
          width: 90,
        }
      ),
      new GridColumn(
        'notificationDetail',
        this.metaData.IH_AdjLanding_NotfnDetail,
        {
          width: 90,
        }
      ),
      new GridColumn('datetime', this.metaData.IH_AdjLanding_DateTime, {
        width: 100,
      }),
    ];
  }

  // New jobs

  private newJobGridColumn(): void {
    this.NewJobDetailColumn = [
      new GridColumn('jobDate', this.metaData.IH_AdjLanding_JobDate, {
        cellTemplate: this.jobDate,
        width: 90,
      }),
      new GridColumn('jobCode', this.metaData.IH_AdjLanding_JobCode, {
        width: 80,
      }),
      new GridColumn(
        'requirementType',
        this.metaData.IH_AdjLanding_ReqType,
        {
          width: 90,
        }
      ),
      new GridColumn('address', this.metaData.IH_AdjLanding_Address, {
        cellTemplate: this.address,
        width: 100,
      }),
    ];
  }

  // Cacncelled assignments

  private assignmentCancelationGridColumn(): void {
    this.AssignmentCancelationDetailColumn = [
      new GridColumn('startTime', this.metaData.IH_AdjLanding_AssignedDate, {
        cellTemplate: this.startTime,
        width: 90,
      }),
      new GridColumn(
        'assignmentReferenceNo',
        this.metaData.IH_AdjLanding_AsgmtID,
        {
          width: 100,
        }
      ),
      new GridColumn('statusReasonTypeName', this.metaData.IH_AdjLanding_Reason, {
        width: 90,
      }),
      new GridColumn(
        'requirementTypeID', this.metaData.IH_AdjLanding_ReqType,
        {
          width: 90,
        }
      ),
      new GridColumn('actionBy', this.metaData.IH_AdjLanding_Action, {
        width: 90,
      }),
    ];
  }

  // columns for Schelule Appointment
  private appointmentGridColumn(): void {
    this.SechduleAppointmentColumn = [
      new GridColumn('startTime', this.metaData.IH_AdjLanding_AppointmentDate, {
        cellTemplate: this.startTime,
        width: 90,
      }),
      new GridColumn(
        'assignmentReferenceNo',
        this.metaData.IH_AdjLanding_AsgmtRefNo,
        {
          width: 100,
        }
      ),
      new GridColumn(
        'requirementTypeID',
        this.metaData.IH_AdjLanding_ReqTypeID,
        {
          width: 90,
        }
      ),
      new GridColumn('clientName', this.metaData.IH_AdjLanding_Client, {
        width: 90,
      }),
      new GridColumn('address', this.metaData.IH_AdjLanding_Address, {
        cellTemplate: this.address,
        width: 100,
      }),
    ];
  }

  // columns for QA Failures
  private qaFailuresGridColumn(): void {
    this.qaFailuresColumn = [
      new GridColumn('reviewDate', this.metaData.IH_AdjLanding_ReviewDate, {
        cellTemplate: this.reviewDate,
        width: 90,
      }),
      new GridColumn('reason', this.metaData.IH_AdjLanding_Reason, {
        width: 90,
      }),
      new GridColumn(
        'assignmentReferenceNo',
        this.metaData.IH_AdjLanding_AsgmtRefNo,
        {
          width: 100,
        }
      ),
      new GridColumn('clientName', this.metaData.IH_AdjLanding_Client, {
        width: 100,
      }),
    ];
  }

  private matchedGridColumns(): void {
    this.matchedColumns = [
      new GridColumn('carrierName', this.metaData.IH_AdjLanding_CarrierName, {
        cellTemplate: this.name,
      }),
      new GridColumn('jobTitle', this.metaData.IH_AdjLanding_JobTitle),
      new GridColumn('stateID', this.metaData.IH_AdjLanding_Location, {
        cellTemplate: this.location,
      }),
      new GridColumn('startDate', this.metaData.IH_AdjLanding_ExpStartDate, {
        cellTemplate: this.startDate,
      }),
      new GridColumn('rateAmount', this.metaData.IH_AdjLanding_RateAmount, {
        cellTemplate: this.rateamount,
      }),
    ];
  }

  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) {
      return filterArr[0].value;
    }
    return '';
  }

  public onDragEnd($event: DragEventModel): void {
    this.value = new Date();
    this.gridIndex[$event.index].status = false;
  }

  // This Function will Save the preference of Card on the home page.
  public savepinned(id: number): void {
    const index = this.gridIndex.findIndex(
      (i: GridIndexModel) => i.tilesViewOrder === id
    );
    this.gridIndex[index].status = true;
    for (let i = 0; i < this.gridIndex.length; i++) {
      this.gridIndex[i].tilesViewOrder = i + 1;
    }
    this.postIndexArray.homePageTilesDetails = this.gridIndex;
    this.adjusterService
      .postHomeData(this.postIndexArray)
      .subscribe((defaultData: boolean) => {
        if (defaultData) {
          this.dialogService.openSnackbar(
            this.metaData.IH_AdjLanding_PrefAddSuccess,
            'success'
          );
        }
      });
  }

  // This Function will route from Matched Jobs  of home page to Particular job details .
  public routeAssignments(type: string): void {
    this.router.navigate([`/contracts/posted-contracts/${type}`]);
  }

  public routeQafail(): void {
    this.router.navigate(['qa-report'], { queryParams: { nav: 2 } });
  }

  //  This Function will call the  API's of the MetaData for HomePage .
  public getMetaData(): Promise<HomePageMetaData> {
    return new Promise<HomePageMetaData>(
      (resolve: Function, reject: Function): void => {
        this.cmsService
          .getMetadata<HomePageMetaData>('IH_Adjuster_LandingPage')
          .subscribe((metaData: HomePageMetaData) => {
            if (metaData) {
              this.metaData = metaData;
              resolve(metaData);
            } else {
              reject('metadata not available');
            }
          });
      }
    );
  }
}
