import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalInfo2Component } from './professional-info2.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';

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
  minSelectedCheckboxes() {
    return '';
  }
}

describe('ProfessionalInfo2Component', () => {
  let component: ProfessionalInfo2Component;
  let fixture: ComponentFixture<ProfessionalInfo2Component>;
  const InsuranceDesignation = [
    {
      key: 'IDAI',
      value: 'AIC'
    },
    {
      key: 'IDAR',
      value: 'ARM'
    },
    {
      key: 'IDCP',
      value: 'CPCU'
    },
    {
      key: 'IDEA',
      value: 'Executive General Adjuster'
    },
    {
      key: 'IDGA',
      value: 'General Adjuster'
    },
    {
      key: 'IDHA',
      value: 'HAAG'
    },
    {
      key: 'IDNA',
      value: 'National General Adjuster'
    },
    {
      key: 'IDP1',
      value: 'PTC1'
    },
    {
      key: 'IDP2',
      value: 'PTC2'
    },
    {
      key: 'IDP3',
      value: 'PTC3'
    },
    {
      key: 'IDNO',
      value: 'None of These'
    }
  ];
  const lossType = [
    {
      key: 'LEEQ',
      value: 'Earthquake'
    },
    {
      key: 'LEEV',
      value: 'Environmental'
    },
    {
      key: 'LEFL',
      value: 'Flood'
    },
    {
      key: 'LEFR',
      value: 'Fire'
    },
    {
      key: 'LEFS',
      value: 'Freeze/Ice/Snow'
    },
    {
      key: 'LEHL',
      value: 'Hail'
    },
    {
      key: 'LEHW',
      value: 'Hurricane/Wind'
    }
  ];
  const SoftwareKnowledge = [
    {
      key: 'SKCC',
      value: 'CCC'
    },
    {
      key: 'SKES',
      value: 'ECS'
    },
    {
      key: 'SKML',
      value: 'Mitchell'
    },
    {
      key: 'SKSO',
      value: 'Simsol'
    },
    {
      key: 'SKSY',
      value: 'Symbility'
    },
    {
      key: 'SKWE',
      value: 'Word/Excel'
    },
    {
      key: 'SKXA',
      value: 'XactAnalysis'
    },
    {
      key: 'SKXC',
      value: 'Xactimate Collaboration'
    },
    {
      key: 'SKXE',
      value: 'Xactimate Estimating'
    }
  ];
  const language = [
    {
      key: 'LSPA',
      value: 'Speak Spanish'
    }
  ];
  const proficiency = [
    {
      key: 'SKEN',
      value: 'None'
    },
    {
      key: 'SKEB',
      value: 'Beginner'
    },
    {
      key: 'SKEI',
      value: 'Intermediate'
    },
    {
      key: 'SKEA',
      value: 'Advanced'
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
    preferredJobTypeView: [],
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
      declarations: [ ProfessionalInfo2Component ],
    });
    TestBed.overrideComponent( ProfessionalInfo2Component, {
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
    fixture = TestBed.createComponent(ProfessionalInfo2Component);
    component = fixture.componentInstance;
    component.insuranceLookup = InsuranceDesignation;
    component.lossTypeLookup = lossType;
    component.softwareLookup = SoftwareKnowledge;
    component.languageLookup = language;
    component.proficiencyLookup = proficiency;
    // component.prelimMeta = PrelimMetaData;
    // component.PrelimData = PrelimData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should check the back functionality', () => {
    component.submitInformation();
    expect(component.loader).toBeFalsy();
    expect(component.langValid).toBeFalsy();
  });

  it('Should check the back functionality', () => {
    component.back();
  });

  it('Should check the back functionality', () => {
    const event = {target: {
      id : 'IDNO'
    }};
    component.validateInsurance(event);
  });


});
