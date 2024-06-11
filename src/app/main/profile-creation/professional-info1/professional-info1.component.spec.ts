import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalInfo1Component } from './professional-info1.component';
import { ReactiveFormsModule, FormsModule, ValidationErrors } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Observable } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { emit } from 'cluster';

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
  addPrelimProf1(): Observable<any> {
    return of([]);
  }
  minSelectedCheckboxes() {
    return '';
  }
}

describe('ProfessionalInfo1Component', () => {
  let component: ProfessionalInfo1Component;
  let fixture: ComponentFixture<ProfessionalInfo1Component>;
  const experienceSubType = [
    {
      key: 'SSAO',
      value: 'Auto'
    },
    {
      key: 'SSPY',
      value: 'Property'
    }
  ];
  const experienceType = [
    {
      key: 'EADP',
      value: 'Auto Desk Adjusting'
    },
    {
      key: 'EAFA',
      value: 'Auto Field Adjusting'
    },
    {
      key: 'EPDA',
      value: 'Property Desk Adjusting'
    },
    {
      key: 'EPFA',
      value: 'Property Field Adjusting'
    }
  ];
  const experiencesView = [
  {
    experienceTypeID: 'EADP',
    experienceYearTypeID: 'ELOY'
  },
  {
    experienceTypeID: 'EAFA',
    experienceYearTypeID: 'ELOY'
  },
  {
    experienceTypeID: 'EPDA',
    experienceYearTypeID: 'ELOY'
  },
  {
    experienceTypeID: 'EPFA',
    experienceYearTypeID: 'ELOY'
  }
  ];
  const speciality = [
    {
      key: 'SAAL',
      value: 'Auto Appraisal'
    },
    {
      key: 'SABI',
      value: 'Auto Bodily Injury'
    },
    {
      key: 'SACL',
      value: 'Auto Commercial'
    },
    {
      key: 'SAAY',
      value: 'Auto Liability'
    },
    {
      key: 'SATL',
      value: 'Auto Total Loss'
    },
    {
      key: 'SPBI',
      value: 'Business Interruption'
    },
    {
      key: 'SPCP',
      value: 'Commercial Property'
    },
    {
      key: 'SPHE',
      value: 'Heavy Equipment'
    },
    {
      key: 'SPLA',
      value: 'Ladder Assist'
    },
    {
      key: 'SPLL',
      value: 'Large Loss'
    },
    {
      key: 'SPLY',
      value: 'Liability'
    },
    {
      key: 'SPMH',
      value: 'Mobile Homes'
    },
    {
      key: 'SPAL',
      value: 'Property Appraisal'
    },
    {
      key: 'SARV',
      value: 'Remote Reviewer for Adjusting Firm'
    },
    {
      key: 'SPRV',
      value: 'Remote Reviewer for Adjusting Firm'
    },
    {
      key: 'SPRP',
      value: 'Residential Property'
    },
    {
      key: 'SPRI',
      value: 'Roof Inspection'
    },
    {
      key: 'SPTS',
      value: 'Two Story Steep'
    },
    {
      key: 'SPWM',
      value: 'Water Mitigation'
    },
    {
      key: 'SPWD',
      value: 'Writing Denial/Coverage Letters'
    },
    {
      key: 'SAWD',
      value: 'Writing Denial/Coverage Letters'
    }
  ];
  const specialitiesView = [
  {specialitiesTypeID: 'SABI', specialitiesSubTypeID: 'SSAO'},
  {specialitiesTypeID: 'SPRV', specialitiesSubTypeID: 'SSPY'}
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
                FormsModule,
                InputsModule,
                DropDownsModule,
                HttpClientTestingModule,
                RouterTestingModule],
      declarations: [ ProfessionalInfo1Component ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent( ProfessionalInfo1Component, {
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
    fixture = TestBed.createComponent(ProfessionalInfo1Component);
    component = fixture.componentInstance;
    component.specialityData  = experienceSubType;
    component.experience = experiencesView;
    component.experienceType = experienceType;
    component.speciality = specialitiesView;
    component.specialitySubType = speciality;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should check the next function', () => {
    component.next();
    expect(component.loader).toBeFalsy();
  });

  it('Should check the back functionality', () => {
    component.back();
  });

  it('Should check the check value function', () => {
    component.checkValue();
    expect(component.expValid).toBeTruthy();
  });
});
