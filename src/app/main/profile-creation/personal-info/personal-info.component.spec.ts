import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoComponent } from './personal-info.component';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule, FormsModule, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';

class BypassService {
  static getData(getData: any) {
    throw new Error('Method not implemented.');
  }
  getMetadata(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
  // buildForm() {
  //   return '';
  // }
  postProfileData(): Observable<any> {
    return of([]);
  }
  minSelectedCheckboxes() {
    return '';
  }
}

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  const stateLookup = [{ key: '42', value: 'Test Name' }];
  const jobPrefLookup = [
    {
      key: 'WKDK',
      value: 'Desk'
    },
    {
      key: 'WKFD',
      value: 'Field'
    }
  ];
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
  const PrelimMetaData = {
    IH_Prelim_Screen_1_Header_1: 'Personal information',
    IH_Prelim_Screen_1_Header_2: 'Professional information',
    IH_Prelim_Screen_1_FirstName_Label: 'First Name',
    IH_Prelim_Screen_1_FirstName_Place_Holder: 'First Name',
    IH_Prelim_Screen_1_LastName_Label: 'Last Name',
    IH_Prelim_Screen_1_LastName_Place_Holder: 'Last Name',
    IH_Prelim_Screen_1_Email_Label: 'Email',
    IH_Prelim_Screen_1_Email_Place_Holder: 'Email',
    IH_Prelim_Screen_1_Phone_Label: 'Phone',
    IH_Prelim_Screen_1_Phone_Place_Holder: 'Phone',
    IH_Prelim_Screen_1_Address_Label: 'Address',
    IH_Prelim_Screen_1_Address_1_Place_Holder: 'Address',
    IH_Prelim_Screen_1_Address_2_Place_Holder: 'Address',
    IH_Prelim_Screen_1_City_Label: 'City',
    IH_Prelim_Screen_1_City_Place_Holder: 'City',
    IH_Prelim_Screen_1_State_Label: 'State',
    IH_Prelim_Screen_1_State_Place_Holder: 'State',
    IH_Prelim_Screen_1_Country_Label: 'Country',
    IH_Prelim_Screen_1_Country_Place_Holder: 'Country',
    IH_Prelim_Screen_1_Zip_Label: 'Zip',
    IH_Prelim_Screen_1_Zip_Place_Holder: 'Zip',
    IH_Prelim_Screen_1_Job_Type: 'Preferred Job Type',
    IH_Prelim_Screen_1_Rate_Type: 'Preferred Rate Type',
    IH_Prelim_Screen_1_How_Did_you_Hear: 'How did you hear about us',
    IH_Prelim_Screen_1_Job_Type_Tooltip: 'abc',
    IH_Prelim_Screen_1_Rate_Type_Tooltip: 'abc',
    IH_Prelim_Screen_1_Rate_Hourly_Tooltip: 'abc',
    IH_Prelim_Screen_1_Rate_Claim_Tooltip: 'abc',
    IH_Prelim_Screen_1_Address_Tooltip: 'abc',
    IH_Prelim_Screen_1_Comments_Place_Holder: 'abc',
    IH_Prelim_Screen_1_Next_Button: 'abc',
    IH_Prelim_Screen_2_Experience_Header: 'abc',
    IH_Prelim_Screen_2_Experience_1_Label: 'abc',
    IH_Prelim_Screen_2_Experience_2_Label: 'abc',
    IH_Prelim_Screen_2_Experience_3_Label: 'abc',
    IH_Prelim_Screen_2_Experience_4_Label: 'abc',
    IH_Prelim_Screen_2_Specialities_Header: 'abc',
    IH_Prelim_Screen_2_Auto_Label: 'abc',
    IH_Prelim_Screen_2_Property_Label: 'abc',
    IH_Prelim_Screen_2_Back_Button: 'abc',
    IH_Prelim_Screen_2_Next_Button: 'abc',
    IH_Prelim_Screen_3_Loss_Header: 'abc',
    IH_Prelim_Screen_3_Designation_Header: 'abc',
    IH_Prelim_Screen_3_Knowledge_Header: 'abc',
    IH_Prelim_Screen_3_Language_Header: 'abc',
    IH_Prelim_Screen_3_Back_Button: 'abc',
    IH_Prelim_Screen_3_Next_Button: 'abc',
    IH_Prelim_Screen_3_Knowledge_Label_1: 'abc',
    IH_Prelim_Screen_3_Knowledge_Label_2: 'abc',
    IH_Prelim_Screen_3_Knowledge_Label_3: 'abc',
    IH_Prelim_Screen_3_Knowledge_Label_4: 'abc',
    IH_Prelim_Screen_1_SubHeader_1: 'abc',
    IH_Prelim_Screen_1_Required_Field: 'abc',
    IH_Prelim_Screen_1_Validation_Select1: 'abc',
    IH_Prelim_Screen_1_Validation_Value: 'abc',
    IH_Prelim_Screen_1_Validation_Hour_Rate: 'abc',
    IH_Prelim_Screen_1_Validation_Hourly_Range: 'abc',
    IH_Prelim_Screen_1_Validation_Claim_Rate: 'abc',
    IH_Prelim_Screen_1_Validation_Claim_Range: 'abc',
    IH_Prelim_Screen_1_Validation_Fee_Range: 'abc',
    IH_Prelim_Screen_1_Job_Type_Label: 'abc',
    IH_Prelim_Screen_1_Hourly_Label: 'abc',
    IH_Prelim_Screen_1_Per_Claim_Label: 'abc',
    IH_Prelim_Screen_1_Hourly: 'abc',
    IH_Prelim_Screen_1_Per_Claim: 'abc',
    IH_Prelim_Screen_1_Per_Hour_Label: 'abc',
    IH_Prelim_Screen_1_Per_Claim_Filler_1: 'abc',
    IH_Prelim_Screen_1_Per_Claim_Filler_2: 'abc',
    IH_Prelim_Screen_1_Hourly_Placholder: 'abc',
    IH_Prelim_Screen_1_Claim_Placholder: 'abc',
    IH_Prelim_Screen_1_Claim_Percent_Placholder: 'abc',
};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        FormsModule,
        InputsModule,
        DropDownsModule,
        HttpClientTestingModule,
        RouterTestingModule],
      declarations: [PersonalInfoComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(PersonalInfoComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService },
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    component.stateLookup = stateLookup;
    component.jobPrefLookup = jobPrefLookup;
    // component.prelimData = PrelimData;
    // component.prelimMeta = PrelimMetaData;
    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('Should check if functions called on ngOnInIt()', () => {
  //   const jobfunction = spyOn(component, 'jobCheckValidator');
  //   expect(jobfunction).toHaveBeenCalledTimes(0);
  // });
  // Checks if form is inavlid or not.
  it('Check Form is invalid when empty', () => {
    expect(component.profileForm.invalid).toBeTruthy();
  });

  it('Should create a form with 17 controls', () => {
    expect(component.profileForm.contains('firstName')).toBeTruthy();
    expect(component.profileForm.contains('lastName')).toBeTruthy();
    expect(component.profileForm.contains('email')).toBeFalsy();
    expect(component.profileForm.contains('phone')).toBeTruthy();
    expect(component.profileForm.contains('adressFirst')).toBeTruthy();
    expect(component.profileForm.contains('adressSecond')).toBeTruthy();
    expect(component.profileForm.contains('city')).toBeTruthy();
    expect(component.profileForm.contains('state')).toBeTruthy();
    expect(component.profileForm.contains('country')).toBeFalsy();
    expect(component.profileForm.contains('zip')).toBeTruthy();
    expect(component.profileForm.contains('reference')).toBeTruthy();
    expect(component.profileForm.contains('comments')).toBeTruthy();
    expect(component.profileForm.contains('rateTypePerHour')).toBeTruthy();
    expect(component.profileForm.contains('rateTypePerClaim')).toBeTruthy();
    expect(component.profileForm.contains('ratePerHour')).toBeTruthy();
    expect(component.profileForm.contains('ratePerClaimFigure')).toBeTruthy();
    expect(component.profileForm.contains('ratePerClaimPercent')).toBeTruthy();
  });

  it('should contain a Job error boolean value', () => {
    expect(component.jobTypeError).toBeFalsy();
  });

  // First name test cases
  it('First name field validity', () => {
    let errors: ValidationErrors;
    const firstName = component.profileForm.controls.firstName;
    expect(firstName.invalid).toBeFalsy();

    // should contain a-z, apostrophe(') and dot(.) only
    firstName.setValue('John Doe');
    expect(firstName.invalid).toBeFalsy();

    // First name field is required
    firstName.setValue('');
    errors = firstName.errors || {};
    expect(errors.required).toBeTruthy();

    // Set First name to something incorrect
    firstName.setValue('John Doe');
    errors = firstName.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeFalsy();
  });

  it('Should check next Function', () => {
    component.next();
    expect(component.profileForm.touched).toBeTruthy();
    expect(component.loader).toBeFalsy();
  });

  it('Should check Submit Function', () => {
    component.next();
    expect(component.loader).toBeFalsy();
  });

  // it('Should check input prevention function', () => {
  //   const event = { keyCode : 48, preventDefault() {return false; } };
  //   component.preventNumberInput(event);
  //   expect(component.isValAssigned).toBeTruthy();
  // });



});
