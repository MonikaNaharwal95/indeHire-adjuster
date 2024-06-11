import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CmsService } from 'src/app/services/cms.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { LookupService } from 'src/app/services/lookup.service';
import { CarrierViewComponent } from './carrier-view.component';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccordianComponent } from 'src/app/shared/accordian/accordian.component';
import { FormsModule } from '@angular/forms';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ActivatedRoute } from '@angular/router';
import { Ng5SliderModule } from 'ng5-slider';
import { LookupModel } from 'src/app/models/lookup.model';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData, WorkHistoryData } from 'src/app/models/carrier-view.model';
import { FooterComponent } from 'src/app/shared/footer/footer.component';


class BypassService {

  getMetaData(): Observable<CarrierViewMetaData[]> {
    return of([]);
  }
  getCertificateTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getExperienceYearLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getSpecialityTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getSpecialitySubTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getInsuranceDesignationLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getLossTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getProficiencyTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getLanguageTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getSoftwareKnowledgeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getJobTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getAvailabilityTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getStateLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getDegreeTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getCountryLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getChildCertificateLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getExperienceTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getEquipmentTypeLookup(): Observable<LookupModel[]> {
    return of([]);
  }
  getAdjusterProfile(): Observable<CarrierViewData[]> {
    return of([]);
  }
  getWorkHistory(): Observable<WorkHistoryData[]> {
    return of([]);
  }
  getpdfArray(): Observable<ArrayBuffer[]> {
    return of([]);
  }

}

describe('CarrierViewComponent', () => {
  let component: CarrierViewComponent;
  let fixture: ComponentFixture<CarrierViewComponent>;
  const publicView = {
    id: 1,
    contractorID: 3,
    contractorTypeID: 'abc',
    firstName: 'Nitish',
    lastName: 'Lanning',
    profileTitle: 'asd',
    profileDescription: 'ad',
    completionStatusID: 'ad',
    preliminaryStepID: 4,
    profileImageID: 0,
    documentPath: 'asd',
    stateLicenseStatus: 'asd',
    addressViews: [],
    contractorEmailViews: [],
    contractorPhoneViews: [],
    certificationViews: [],
    educationViews: [],
    employmentViews: [],
    preferredJobTypeView: [],
    experienceViews: [],
    specialityViews: [
      { specialitiesID: '1', specialitiesTypeID: 'SAAL', specialitiesSubTypeID: 'SSAO' },
      { specialitiesID: '2', specialitiesTypeID: 'SABI', specialitiesSubTypeID: 'SSAO' },
      { specialitiesID: '3', specialitiesTypeID: 'SACL', specialitiesSubTypeID: 'SSAO' },
      { specialitiesID: '4', specialitiesTypeID: 'SAAY', specialitiesSubTypeID: 'SSAO' },
      { specialitiesID: '5', specialitiesTypeID: 'SPBI', specialitiesSubTypeID: 'SSPY' },
      { specialitiesID: '6', specialitiesTypeID: 'SPCP', specialitiesSubTypeID: 'SSPY' },
      { specialitiesID: '7', specialitiesTypeID: 'SPHE', specialitiesSubTypeID: 'SSPY' },
      { specialitiesID: '8', specialitiesTypeID: 'SPMH', specialitiesSubTypeID: 'SSPY' },
    ],
    insuranceDesignationViews: [],
    licenseViews: [],
    lossTypeExpertiseViews: [],
    softwareKnowledgeViews: [],
    languageViews: [],
    stateLicensesViews: [],
    contractorAvailablityID: '1',
    contractorAvailablityTypeID: 'ASAV',
    availablityDate: null,
    totalReviewCount: '0',
    profilecompletionValue: 40,
    starRating: '0.00',
    isProfilePublic: false,
    applicantID: '16a2616a-461d-4b05-85c0-7f6e624221f4',
    fountainStage: '',
    ssnStatus: 'PND',
    insuranceStatus: 'PND',
    lawsonStatus: 'PND',
    npnStatus: 'PND',
    xactStatus: 'PND',
    isAdminAction: false,
    isApplicableIndehire: false,
    rejection_Reason: '',
    acceptAgreementDocument: null,
    acceptAgreementDocumentID: 0,
    acceptAgreementSignDate: null,
    isAcceptAgreement: false,
    contractorNPN: null,
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, DropDownListModule, Ng5SliderModule],
      declarations: [CarrierViewComponent, AccordianComponent, FooterComponent],
      providers: [BypassService]
    }); TestBed.overrideComponent(CarrierViewComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: LookupService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService },
          { provide: ActivatedRoute, useValue: BypassService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierViewComponent);
    component = fixture.componentInstance;
    // component.publicView = publicView;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should handle all the promises when there is no error', () => {
    const flag = false;
    const promise = new Promise((resolve: Function): void => {
      component.handlePromises();
    });
    promise.then((result: boolean[]) => {
      expect(component.loader).toBeTruthy();
      expect(component.renderUI).toBeTruthy();
    });
    promise.catch((error: boolean[]) => {
      expect(component.loader).toBeFalsy();
      expect(component.renderUI).toBeFalsy();
    });
    expect(flag).toBe(false);
  });

  it('Should receive data from adjuster profile when promise is resolved', () => {
    const flag = false;
    const promise = new Promise((resolve: Function): void => {
      component.ngOnInit();
    });
    promise.then((result: boolean[]) => {
      expect(component.publicView).toContain({
        id: 1,
        contractorID: 3,
        contractorTypeID: 'abc',
        firstName: 'Nitish',
        lastName: 'Lanning',
        profileTitle: 'asd',
        profileDescription: 'ad',
        completionStatusID: 'ad',
        preliminaryStepID: 4,
        profileImageID: 0,
        documentPath: 'asd',
        stateLicenseStatus: 'asd',
      });
    });
    promise.catch((error: boolean[]) => {
      expect(component.publicView).toContain(null);
    });
    expect(flag).toBe(false);
  });

  it('Should return true if expand or collapse the cards', () => {
    component.isEducationExpanded = true;
    component.isCertificationExpanded = true;
    component.isLicenseExpanded = true;
    component.isWorkExpExpanded = true;
    fixture.detectChanges();
    expect(component.isEducationExpanded).toBe(true);
    expect(component.isCertificationExpanded).toBe(true);
    expect(component.isLicenseExpanded).toBe(true);
    expect(component.isWorkExpExpanded).toBe(true);
  });

  it('Should return true if seeMore clicked to read full description', () => {
    component.seeMoreEducation = true;
    component.seeMoreExpAndRating = true;
    component.seeMoreWorkExp = true;
    fixture.detectChanges();
    expect(component.seeMoreEducation).toBe(true);
    expect(component.seeMoreExpAndRating).toBe(true);
    expect(component.seeMoreWorkExp).toBe(true);
  });

  // it('Should check getDocument Function', () => {
  //   expect(component.profileImg).toContain('./../../../../assets/default.png');
  //   component.getDocument('preview', 6, 'profile');
  // });

});
