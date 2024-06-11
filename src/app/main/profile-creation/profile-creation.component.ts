import { LookupService } from './../../services/lookup.service';
import { LookupModel, ContractorLookupModel } from 'src/app/models/lookup.model';
import { Lookups } from './../../services/lookups';
import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, Data } from '@angular/router';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';
import { PrelimMetaData } from 'src/app/models/prelim.metadata';
import { PrelimData } from './../../models/prelim-get-data.model';
import { ValidatorService } from 'src/app/services/validator.service';
import { ElementRef } from '@angular/core';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';

@Component({
  selector: 'inde-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrls: ['./profile-creation.component.scss']
})
export class ProfileCreationComponent implements OnInit {

  @ViewChild('scrollWrapper', { static: false }) scroller: ElementRef;
  public pageId: number;
  public prelimData: PrelimData;
  public prelimMeta: PrelimMetaData;
  public loader: boolean = false;
  public renderHtml: boolean;
  public refrenceData: LookupModel[] = [];
  public callingCodes: LookupModel[] = [];
  public experienceType: LookupModel[] = [];
  public experiencesYear: LookupModel[] = [];
  public specialitySubType: LookupModel[] = [];
  public specialityData: LookupModel[] = [];
  public stateLookup: LookupModel[] = [];
  public jobPrefData: LookupModel[] = [];
  public insuranceData: LookupModel[]  = [];
  public lossTypeData: LookupModel[] = [];
  public softwareData: LookupModel[] = [];
  public languateData: LookupModel[] = [];
  public proficiencyData: LookupModel[] = [];
  public countryLookup: LookupModel[] = [];
  public industryLookup: LookupModel[] = [];
  public equipmentData: LookupModel[] = [];
  public contractorLookup: ContractorLookupModel[] = [];
  public validationMessage: ValidationMessage;
  private promiseArray: Promise<string>[] = [];

  constructor(
      private adjService: AdjusterService,
      private cmsService: CmsService,
      private lookupService: LookupService,
      private validatorService: ValidatorService
  ) { }

  get contractorType(): string {
    return localStorage.getItem('indehire-ContractorType');
  }

  public ngOnInit(): void {
    this.loader = true;
    this.getLookUpDataFirstPage();
    this.getMetaData();
    this.getData();
    if (this.contractorType) {
      this.getLookUpDataSecondPage();
      this.getLookUpDataThirdPage();
    }
    // Promise to handle API Response and rendering html
    Promise.all(this.promiseArray)
    .then((res: string[]) => {
      this.loader = false;
      this.renderHtml = true;
      this.promiseArray = [];
    })
    .catch((err: string[]) => {
      this.loader = false;
      this.renderHtml = false;
    });
  }

  public getMetaData(): void {
    this.cmsService.getMetadata<PrelimMetaData>('IH_PrelimScreenPPage').subscribe(
      (metaData: PrelimMetaData) => {
        if (metaData) {
          this.prelimMeta = metaData;
          this.validationMessage = this.validatorService.validationMessage;
        }
      }
    );
  }

  private getData(): void {
    this.adjService.getPrelimData().subscribe(
      (data: PrelimData) => {
        if (data) {
          this.prelimData = data;
          this.RedirectToPage();
        }
      }
    );
  }

  public RedirectToPage(): void {
    this.pageId = +localStorage.getItem('indehire_Prelim');
  }

  public backClicked(): void {
    if (this.pageId === 1) {
      this.getLookUpDataSecondPage();
      this.getLookUpDataThirdPage();
    }
    this.getData();
    this.scroller.nativeElement.scrollTop = 0;
  }

  // This method calls all the lookups of first page.
  private getLookUpDataFirstPage(): void {
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getIndustryLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.industryLookup = data;
          resolve();
        }
        reject('Industry');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getIndustryLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.industryLookup = data;
          resolve();
        }
        reject('Industry');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getContractorLookup().subscribe((data: ContractorLookupModel[]) => {
        if (data) {
          this.contractorLookup = data;
          resolve();
        }
        reject('contractor');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          // const filterState = data.filter((val: LookupModel) => val.key.trim() !== 'US_CA');
          this.stateLookup = data;
          // this.loader = false;
          resolve();
        }
        reject('State');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getCountryLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.countryLookup = data;
          resolve();
        }
        reject('Country');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSignupRefrence().subscribe((data: LookupModel[]) => {
        if (data) {
          this.refrenceData = data;
          resolve();
        }
        reject('Reference');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getCallingCode().subscribe((data: LookupModel[]) => {
        if (data) {
          this.callingCodes = data;
          resolve();
        }
        reject('calling code');
      });
    }));

  }

  // This method calls all the lookups of second page.
  private getLookUpDataSecondPage(): void {
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getExperienceTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.experienceType = data;
          resolve();
        }
        reject('Experience Type');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getExperienceYearLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.experiencesYear = data;
          resolve();
        }
        reject('Experience Year Type');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSpecialitySubTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.specialitySubType = data;
          resolve();
        }
        reject('Speciality Subtype');
      });
    }));
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSpecialityTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.specialityData = data;
          resolve();
        }
        reject('Speciality Type');
      });
    }));
  }

  // This method will call all the lookups data of third page.
  private getLookUpDataThirdPage(): void {
    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getLossTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.lossTypeData = data;
          resolve();
        }
        reject('Loss Type');
      });
    }));

    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getInsuranceDesignationLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.insuranceData = data;
          resolve();
        }
        reject('Insurance Type');
      });
    }));

    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getEquipmentTypeLookup().subscribe(data => {
        if (data) {
          this.equipmentData = data;
          resolve();
        }
        reject('Equipment Type');
      });
    }));

    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSoftwareKnowledgeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.softwareData = data;
          resolve();
        }
        reject('Insurance Type');
      });
    }));

    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getLanguageTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.languateData = data;
          resolve();
        }
        reject('Language Type');
      });
    }));

    this.promiseArray.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getProficiencyTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.proficiencyData = data;
          resolve();
        }
        reject('Proficiency Type');
      });
    }));
  }

}
