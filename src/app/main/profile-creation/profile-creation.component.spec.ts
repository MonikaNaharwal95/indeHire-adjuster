import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCreationComponent } from './profile-creation.component';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { of, Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LookupService } from './../../services/lookup.service';


class BypassService {
  static getData(getData: any) {
    return of([]);
  }
  getMetadata(): Observable<any> {
    return of([]);
  }
  getPrelimData(): Observable<any> {
    return of([]);
  }
  getJobTypeLookUp(): Observable<any> {
    return of([]);
  }
  getStateLookUp(): Observable<any> {
    return of([]);
  }
  getCountryLookUp(): Observable<any> {
    return of([]);
  }
  getSignupRefrence(): Observable<any> {
    return of([]);
  }
  getExperienceYearLookUp(): Observable<any> {
    return of ([]);
  }
  getSpecialitySubTypeLookUp(): Observable<any> {
    return of ([]);
  }
  getSpecialityTypeLookUp(): Observable<any> {
    return of ([]);
  }
  getLossTypeLookUp(): Observable<any> {
    return of ([]);
  }
  getInsuranceDesignationLookUp(): Observable<any> {
    return of ([]);
  }
  getSoftwareKnowledgeLookUp(): Observable<any> {
    return of ([]);
  }
  getLanguageTypeLookUp(): Observable<any> {
    return of ([]);
  }
  getExperienceTypeLookUp(): Observable<any> {
    return of ([]);
  }
  getProficiencyTypeLookUp(): Observable<any> {
    return of ([]);
  }
}

describe('ProfileCreationComponent', () => {
  let component: ProfileCreationComponent;
  let fixture: ComponentFixture<ProfileCreationComponent>;

  const PrelimData = {
    firstName: 'Sanket',
    lastName: 'Singh',
    phoneNumber: '9988776655',
    emailAddress: 'sanket@primussoft.com',
    countryID: 'US',
    state: 'US_AK',
    city: 'Atlanta',
    postalCode: '22334',
    address1: 'string',
    address2: 'string',
    signupReferenceTypeID: 'SRFB',
    signupReferenceInfo: null,
    preferredJobTypeView: [{workEnvironmentTypeID: 'WKDK', preferredRateTypeView: {
      rateTypeID: 'hour',
      rateAmount: '10.00',
      ratePercentage: '0.00',
    }},
    {workEnvironmentTypeID: 'WKFD', preferredRateTypeView: {
      rateTypeID: 'hour',
      rateAmount: '10.00',
      ratePercentage: '0.00',
    }}],
    preferredRateTypeView: [],
    experiencesView: [],
    specialitiesView: [],
    languageTypeView: [],
    softwareKnowledgeView: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
                RouterTestingModule],
      declarations: [ ProfileCreationComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(ProfileCreationComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService },
          { provide: LookupService, useClass: BypassService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCreationComponent);
    component = fixture.componentInstance;
    // component.prelimData = PrelimData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('Should check the back function', () => {
  //   component.backClicked();
  //   expect(component.loader).toBeFalsy();
  // });
});
