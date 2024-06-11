import { CmsService } from './../../services/cms.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { LookupModel } from 'src/app/models/lookup.model';
import { LookupService } from 'src/app/services/lookup.service';
import { Options } from 'ng5-slider';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DialogService } from 'src/app/services/dialog.service';
import { JobActionModel, JobFiltermodel } from 'src/app/models/view-job.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { JobsMetadata } from 'src/app/models/jobs.metadata';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { JobTypeModel } from 'src/app/models/jobs.model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'inde-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit, OnDestroy {
  // New For Flow
  public jobStatus: 'JBMT' | 'JBSV' | 'JBSG' = 'JBMT';
  public savedJobArray: JobTypeModel[] = [];
  public viewJobArray: JobTypeModel[] = [];
  public matchJobArray: JobTypeModel[] = [];
  public suggestedJobArray: JobTypeModel[] = [];
  @ViewChild('jobDialog', { static: true })
  public jobDialog: JobDetailComponent;
  @ViewChild('noJobAlert', { static: true })
  public jobAlert: AlertDialogComponent;
  public htmlLoader: boolean = true;
  public jobsMetadata: JobsMetadata;
  public locationLookup: LookupModel[];
  public specilitiesLookup: LookupModel[];
  public relevanceLookup: LookupModel[];
  public defaultSpeciality: LookupModel;
  public addressValue: string;
  public newAddress: string[];
  public sliderOptions: Options = {
    floor: 10,
    ceil: 100,
    showSelectionBar: true,
    translate: (value: number): string => {
      return value + ' miles';
    },
  };
  public filterForm: FormGroup;
  public formSubscription: Subscription;
  public apiSubscription: Subscription;
  public isLoading: boolean;
  public selectedJob: number;
  public selectedJobTitle: string;
  public isFirst: boolean;
  public routerSubscription: Subscription;

  constructor(
    private lookupService: LookupService,
    private adjusterService: AdjusterService,
    private dialogService: DialogService,
    private cmsService: CmsService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  public get formKey(): FormKeysModel {
    return this.filterForm.controls;
  }

  public ngOnInit(): void {
    this.getJobsMetadata();
    this.getLookups();
    this.filterInit();
    this.getJobs('JBSV');
    this.getJobs('JBSG');
  }

  public getJobs(status: 'JBMT' | 'JBSV' | 'JBSG' = null): void {
    const filters = this.filterForm.value;
    this.apiSubscription = this.adjusterService
      .getJobs(status ? status : this.jobStatus, filters)
      .subscribe((res: JobTypeModel[]) => {
        if (res) {
          if (status === 'JBMT') {
            this.matchJobArray = res;
            this.notificationRoute();
            if (!this.isFirst) {
              this.jobByStatus('JBMT');
              this.isFirst = true;
            }
            this.htmlLoader = false;
          } else if (status === 'JBSV') {
            this.savedJobArray = res;
          } else {
            this.suggestedJobArray = res;
            // this.addressValue = res[0].location;
            // this.validate(this.addressValue);
          }
          this.jobByStatus(this.jobStatus);
        }
      });
  }

  public jobByStatus(status: 'JBMT' | 'JBSV' | 'JBSG'): void {
    this.viewJobArray = [];
    switch (status) {
      case 'JBMT':
        this.viewJobArray = this.matchJobArray;
        this.pullAddressView();
        break;
      case 'JBSV':
        this.viewJobArray = this.savedJobArray;
        this.pullAddressView();
        break;
      case 'JBSG':
        this.viewJobArray = this.suggestedJobArray;
        this.pullAddressView();
        break;
    }
  }

  public markAsDisLiked(job: JobTypeModel, status: boolean): void {
    this.isLoading = true;
    const formData: JobActionModel = {
      jobID: job.jobID,
      isDisLike: status,
      isSave: job.isSave,
    };
    this.adjusterService.jobFeedback(formData).subscribe((res: boolean) => {
      this.isLoading = false;
      if (res) {
        this.refreshJobs();
        this.dialogService.openSnackbar(
          this.jobsMetadata.IH_AdjusterJobs_JobSaveSuccess,
          'success'
        );
      }
    });
  }

  public markAsSaved(job: JobTypeModel, status: boolean): void {
    this.isLoading = true;
    const formData: JobActionModel = {
      jobID: job.jobID,
      isDisLike: job.isDisLike,
      isSave: status,
    };
    this.adjusterService.jobFeedback(formData).subscribe((res: boolean) => {
      this.isLoading = false;
      if (res) {
        this.dialogService.openSnackbar(
          this.jobsMetadata.IH_AdjusterJobs_JobSaveSuccess,
          'success'
        );
        this.refreshJobs();
      }
    });
  }

  private pullAddressView(): void {
    this.viewJobArray.forEach((item: JobTypeModel, i: number) => {
      if (item.location) {
        const address = item.location.split(',');
        if (address.length === 4) {
          const updatedVal = address.slice(1, 4).join();
          item.addressView = updatedVal;
        }
      }
    });
  }

  public filterInit(): void {
    this.filterForm = new FormGroup({
      specialties: new FormControl(''),
      distance: new FormControl(100),
      location: new FormControl(null, { updateOn: 'blur' }),
      relevance: new FormControl('RNEW'),
    });
    this.formSubscription = this.filterForm.valueChanges.subscribe(
      (_formChange: JobFiltermodel) => {
        if (this.jobStatus === 'JBMT') {
          if (this.apiSubscription) {
            this.apiSubscription.unsubscribe();
          }
          this.getJobs('JBMT');
        }
      }
    );
    this.getJobs('JBMT');
  }

  private getJobsMetadata(): void {
    this.cmsService
      .getMetadata<JobsMetadata>('IH_Adjuster_Jobs')
      .subscribe((metadata: JobsMetadata) => {
        if (metadata) {
          this.jobsMetadata = metadata;
          this.defaultSpeciality = {
            key: '',
            value:
              metadata.IH_AdjusterJobs_Filter +
              ' ' +
              metadata.IH_AdjusterJobs_Specialities,
          };
        }
      });
  }

  private getLookups(): void {
    this.lookupService
      .getSpecialityTypeLookUp()
      .subscribe((speciality: LookupModel[]) => {
        if (speciality) {
          this.specilitiesLookup = speciality;
        }
      });
    this.lookupService
      .getRelevanceLookUp()
      .subscribe((relevance: LookupModel[]) => {
        if (relevance) {
          this.relevanceLookup = relevance;
        }
      });
  }

  public notificationRoute(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.jobAlert.close();
    }
    this.routerSubscription = this.actRoute.queryParams.subscribe(
      (_query: Params) => {
        const param = this.actRoute.snapshot.queryParamMap.get('nav');
        const key = param ? JSON.parse(atob(param)) : null;
        if (key) {
          let allJobs: JobTypeModel[] = [];
          allJobs = allJobs.concat(this.matchJobArray);
          allJobs = allJobs.concat(this.savedJobArray);
          allJobs = allJobs.concat(this.suggestedJobArray);
          const filterArr = allJobs.find(
            (item: JobTypeModel) => item.jobID === +key
          );
          if (filterArr) {
            this.jobDetail(filterArr);
          } else {
            this.jobAlert.show();
          }
        }
      }
    );
  }

  public refreshJobs(): void {
    this.getJobs('JBMT');
    this.getJobs('JBSV');
    this.getJobs('JBSG');
  }

  public jobDetail(view: JobTypeModel): void {
    this.selectedJob = view.jobID;
    this.selectedJobTitle = view.jobCode;
    this.jobDialog.jobID = this.selectedJob;
    this.jobDialog.jobDetails = view;
    this.jobDialog.jobStatus = this.jobStatus;
    this.jobDialog.openDialog();
  }

  public cancelJobAlert(): void {
    this.jobAlert.close();
    this.router.navigateByUrl('/jobs');
  }

  public ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
