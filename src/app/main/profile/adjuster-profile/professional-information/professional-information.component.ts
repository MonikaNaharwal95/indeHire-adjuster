import { Component, OnInit, EventEmitter, Input, Output, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import {DialogService} from '.././../../../services/dialog.service';
import {Lookups} from '.././../../../services/lookups';
import { LookupService } from '.././../../../services/lookup.service';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from '.././../../../services/adjuster.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { LookupModel } from 'src/app/models/lookup.model';
import * as _ from 'lodash';
import { ValidationMessage } from '../../../../models/validation-message.metadata';
import { Options } from 'ng5-slider/options';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData, LanguageViews, LossTypeExpertiseViews, ExperienceViews,
         SpecialityViews, InsuranceDesignationViews, SoftwareKnowledgeViews, EquipmentViews } from 'src/app/models/carrier-view.model';
import { SoftwareValueChange } from 'src/app/models/adjuster-profile.model';
import { findIndex } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { EquipmentImageComponent } from './equipment-image/equipment-image.component';

export interface LookupObject {
  key: string;
  value: string;
  isChecked?: boolean;
  isHidden?: boolean;
  isMandatory?: boolean;
  status?: boolean;
  enable?: boolean;
}
@Component({
  selector: 'inde-professional-information',
  templateUrl: './professional-information.component.html',
  styleUrls: ['./professional-information.component.scss']
})
export class ProfessionalInformationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  @Output() proInformationEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('addEquipmentDialog', {static: false}) public addEquipmentDialog: EquipmentImageComponent;
  public travelSlider: Options;
  public travelValue: number;
  public isTravelLoad: boolean;
  public loader: boolean = false;
  public validationMsg: ValidationMessage;

  public experienceLookup: LookupModel[] = [];
  public yearExpLookup: LookupModel[] = [];
  public specialitiesLookup: LookupModel[] = [];
  public specialitiesSubTypeLookup: LookupModel[] = [];
  public insuranceDesignation: LookupModel[] = [];
  public lossExpertiseLookup: LookupModel[] = [];
  public prociencyLookup: LookupModel[] = [];
  public languageLookup: LookupModel[] = [];
  public softwareLookup: LookupModel[] = [];
  public equipmentsLookup: LookupModel[] = [];


  public editEquipmentsFlag: boolean = false;
  public mandatoryEquipmentFlag: boolean;
  public editinsuranceDesignationFlag: boolean = false;
  public editsoftwareKnowledgeFlag: boolean = false;
  public editworkExperienceFlag: boolean = false;
  public editLossTypeFlag: boolean = false;
  public editLanguageFlag: boolean = false;

  public noneAutoFlag: boolean = false;
  public nonePropertyFlag: boolean = false;

  public editLossTypeObject: LookupObject[] = [];
  public editLossTypeArray = [];
  public editEquipmentObject: LookupObject[] = [];
  public editEquipmentArray = [];
  public editinsuranceDesignationObject: LookupObject[] = [];
  public editinsuranceDesignationArray = [];
  public editLanguageObject: LanguageViews[] = [];
  public editsoftwareKnowledgeObject: SoftwareKnowledgeViews[] = [];
  public editworkExperienceObject: ExperienceViews[] = [];
  public editPropertyObject: LookupObject[] = [];
  public editAutoObject: LookupObject[] = [];
  public stateLookup: LookupModel[] = [];
  public editPropertyArray = [];
  public editAutoArray = [];
  public languageShowFlag: boolean = false;
  public autoSpecialityFlag: boolean = false;
  public propertySpecialityFlag: boolean = false;
  public userType: string = '';
  public softOther: string;
  public equipOther: string;
  public showOther: boolean;
  public softwareOtherFlag: boolean;
  public travelEditMode: boolean;
  public editSlider: boolean = true;
  public relocateSubscription: Subscription;
  public showStates: boolean;
  public travelForm: FormGroup;
  public promises: Promise<undefined | string>[] = [];
  public openDialog: boolean;


  constructor(
    private adjService: AdjusterService,
    private fb: FormBuilder,
    private cmsService: CmsService,
    private dialog: DialogService,
    private validatorService: ValidatorService,
    private lookupService: LookupService,
  ) { }

  public get keysFirst(): FormKeysModel {
    return this.travelForm.controls;
  }

  ngOnInit(): void {
    this.travelSlider = {
      floor: 10,
      ceil: 100,
      step: 5,
      readOnly: true,
      showSelectionBar: true,
      translate: (value: number): string => {
        return value + ' ' + this.metaData.IH_AdjusterPage_Miles;
      },
    };
    this.travelValue = this.publicView.travelDistance;
    this.userType = this.publicView.contractorTypeMappingViews[0].contractorTypeID;
    // Lookups Call Staring

    this.lookupService.getExperienceTypeLookUp().subscribe((data: LookupModel[]) => {
      this.experienceLookup = data;
    });

    this.lookupService.getExperienceYearLookUp().subscribe((data: LookupModel[]) => {
      this.yearExpLookup = data;
    });

    this.lookupService.getSpecialityTypeLookUp().subscribe((data: LookupModel[]) => {
      this.specialitiesLookup = data;
    });
    this.lookupService.getInsuranceDesignationLookUp().subscribe((data: LookupModel[]) => {
      this.insuranceDesignation = data;
    });

    this.lookupService.getEquipmentTypeLookup().subscribe((data: LookupModel[]) => {
      this.equipmentsLookup = data;
    });

    this.lookupService.getLossTypeLookUp().subscribe((data: LookupModel[]) => {
      this.lossExpertiseLookup = data;
    });

    this.lookupService.getProficiencyTypeLookUp().subscribe((data: LookupModel[]) => {
      this.prociencyLookup = data;
    });

    this.lookupService.getLanguageTypeLookUp().subscribe((data: LookupModel[]) => {
      this.languageLookup = data;
    });

    this.lookupService.getSoftwareKnowledgeLookUp().subscribe((data: LookupModel[]) => {
      this.softwareLookup = data;
    });

    this.lookupService.getSpecialitySubTypeLookUp().subscribe((data: LookupModel[]) => {
      this.specialitiesSubTypeLookup = data;
      this.specialities();
    });
    this.getLookupData();
    // Lookups Ending
    this.validationMsg = this.validatorService.validationMessage;
    // Thsese are new Form controls for travel section.
    this.travelForm = new FormGroup({
      isWillingRelocate: new FormControl('', Validators.required),
      relocateState: new FormControl(),
    });
    this.handleValidations();

  }

  public openEquipmentDialog(): void {
    this.addEquipmentDialog.openEquipmentDialog();
 }
 public closeEquipmentDialog(): void {
   this.addEquipmentDialog.closeEquipmentDialog();
 }

  ngOnChanges(): void {
    this.specialities();
    this.languageShow();
  }


  private specialities(): void {
    this.autoSpecialityFlag = false;
    this.propertySpecialityFlag = false;
    this.publicView.specialityViews.forEach((element: SpecialityViews) => {
      if (element.specialitiesSubTypeID === 'SSPY') {
           this.propertySpecialityFlag = true;
      }
      if (element.specialitiesSubTypeID === 'SSAO') {
        this.autoSpecialityFlag = true;
    }
      element.specialitiesTypeName = this.getValueByKey(element.specialitiesTypeID , this.specialitiesLookup) ;
    });
  }


  private languageShow(): void {
    this.languageShowFlag = false;
    this.publicView.languageViews.forEach((element: LanguageViews) => {
      if (element.isSpeak) {
           this.languageShowFlag = true;
      }
    });
  }

  public editInsuranceDesignation(): void {
    this.workExperienceCancel();
    this.cancelLossType();
    this.cancelEquipments();
    this.editsoftwareKnowledgeObject = [];
    this.editsoftwareKnowledgeFlag = false;
    this.cancelLanguage();
    this.editinsuranceDesignationArray = [];


    (this.editinsuranceDesignationFlag) ? this.editinsuranceDesignationFlag = false : this.editinsuranceDesignationFlag = true;
    if (this.editinsuranceDesignationFlag) {
      this.editinsuranceDesignationObject = _.cloneDeep(this.insuranceDesignation);
      this.editinsuranceDesignationObject.forEach((ele: LookupObject) => {
      const ob1 = this.publicView.insuranceDesignationViews.find((o: InsuranceDesignationViews) => o.isnuranceDesignationTypeID === 'IDNO');
      if (ob1) {
        if (ele.key === 'IDNO') {
          ele.status = true;
          ele.enable = true;
          this.editinsuranceDesignationArray.push(ele.key);
        } else {
          ele.status = false;
          ele.enable = false;
        }
        } else {
          const ob =  this.publicView.insuranceDesignationViews.find(
            (o: InsuranceDesignationViews) => o.isnuranceDesignationTypeID === ele.key);
          if (ob) {
              ele.status = true;
              ele.enable = true;
              this.editinsuranceDesignationArray.push(ele.key);
            } else {
              ele.status = false;
              ele.enable = true;
            }
        }

      });
    }
  }

  public insuranceDesignationChange(key: string, status: boolean): void {
    this.editinsuranceDesignationArray = [];
    if (key === 'IDNO' && status) {
      this.editinsuranceDesignationObject.forEach((obj: LookupObject) => {
        if (obj.key === 'IDNO') {
          obj.status = true;
          obj.enable = true;
          this.editinsuranceDesignationArray.push(obj.key);
        } else {
          obj.status = false;
          obj.enable = false;
        }
      }
      );

    } else if (key === 'IDNO' && status === false) {
      this.editinsuranceDesignationObject.forEach((obj: LookupObject) => {
        obj.status = false;
        obj.enable = true;
    }
    );
      this.editinsuranceDesignationArray = [];
    } else {
    this.editinsuranceDesignationArray = [];
    this.editinsuranceDesignationObject.forEach((obj: LookupObject) => {
      if (obj.status) {
        this.editinsuranceDesignationArray.push(obj.key);
      } else {
      const index =  this.editinsuranceDesignationArray.indexOf(obj.key);
      if (index !== -1) {
           this.editinsuranceDesignationArray.splice(index, 1 );
        }
    }
     });
    }
  }

  public saveinsuranceDesignation(): void {
    this.dialog.isLoading(true);
    this.loader = true;
    const putID = {
    insuranceDesignationTypeID: this.editinsuranceDesignationArray.join()

  };
    this.adjService.putInsuranceDesignation(putID).subscribe(
    (data: boolean) => {
      if (data) {
        this.loader = false;
        // this.getAdjusterData();
        this.proInformationEvent.emit();
        this.cancelinsuranceDesignation();
        this.dialog.isLoading(false);
        this.dialog.openSnackbar(
          `${this.metaData.IH_AdjusterPage_Insurance_Designation} ${this.validationMsg.IH_updated_Success}`, 'success'
        );
      } else {
        this.dialog.isLoading(false);
        this.loader = false;
      }

    }
  );

  }

  public cancelinsuranceDesignation(): void {
    this.editinsuranceDesignationFlag = false;
    this.editinsuranceDesignationObject = [];
    this.editinsuranceDesignationArray = [];

  }


  public editSoftwareKnowledge(): void {
    this.workExperienceCancel();
    this.cancelinsuranceDesignation();
    this.cancelLossType();
    this.cancelLanguage();
    this.cancelEquipments();

    (this.editsoftwareKnowledgeFlag) ? this.editsoftwareKnowledgeFlag = false : this.editsoftwareKnowledgeFlag = true;
    if (this.editsoftwareKnowledgeFlag) {
      this.editsoftwareKnowledgeObject = _.cloneDeep(this.publicView.softwareKnowledgeViews);
      this.softOther = this.publicView.softwareKnowledgeViews.find(
        (item: SoftwareKnowledgeViews) => item.softwareKnowledgeTypeID === 'SKOT').optionNotes;
      const othersCheck = this.publicView.softwareKnowledgeViews.find(
        (item: SoftwareKnowledgeViews) => item.softwareKnowledgeTypeID === 'SKOT');
      this.changeSoftwareKnowledge(othersCheck);
    }
  }

  public changeSoftwareKnowledge(data: SoftwareValueChange): void {
    if (data.softwareKnowledgeTypeID === 'SKOT' && data.softwareKnowledgeExperienceTypeID !== 'SKEN' && data.optionNotes === '') {
      this.softwareOtherFlag = true;
    } else {
      this.softwareOtherFlag = false;
    }
  }

  public saveSoftwareKnowledge(): void {
    this.dialog.isLoading(true);
    this.loader = true;
    const putSk = {
      softwareKnowledges: this.editsoftwareKnowledgeObject
    };
    this.adjService.putSoftwareKnowledge(putSk).subscribe(
      (data: boolean) => {
        if (data) {
          this.loader = false;
          // this.getAdjusterData();
          this.proInformationEvent.emit();
          this.editsoftwareKnowledgeFlag = false;
          this.softOther = '';
          this.dialog.isLoading(false);
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Software_Knowledge}
          ${this.validationMsg.IH_updated_Success}`, 'success');
        } else {
          this.loader = false;
          this.dialog.isLoading(false);
        }

      }
    );
  }


  public cancelSoftwareKnowledge(): void {
    this.editsoftwareKnowledgeObject = [];
    this.editsoftwareKnowledgeFlag = false;
  }

  public editLossType(): void {
    this.workExperienceCancel();
    this.cancelinsuranceDesignation();
    this.cancelEquipments();
    this.editsoftwareKnowledgeObject = [];
    this.editsoftwareKnowledgeFlag = false;
    this.cancelLanguage();
    this.editLossTypeArray = [];

    (this.editLossTypeFlag) ? this.editLossTypeFlag = false : this.editLossTypeFlag = true;
    if (this.editLossTypeFlag) {
      this.editLossTypeObject = _.cloneDeep(this.lossExpertiseLookup);
      this.editLossTypeObject.forEach((obj: LookupObject) => {
      let ob = {};
      ob =  this.publicView.lossTypeExpertiseViews.find((o: LossTypeExpertiseViews) => o.lossTypeID === obj.key);
      if (ob) {obj.status = true; this.editLossTypeArray.push(obj.key); }  else {
      obj.status = false;
      }
      });
    }

  }

  public lossTypeChange(): void {
    this.editLossTypeArray = [];
    this.editLossTypeObject.forEach((obj: LookupObject) => {
      if (obj.status) {
        this.editLossTypeArray.push(obj.key);
      } else {
      const index =  this.editLossTypeArray.indexOf(obj.key);
      if (index !== -1) {
           this.editLossTypeArray.splice(index, 1);
        }
    }
     });
  }

  public saveLossType(): void {
    this.dialog.isLoading(true);
    this.loader = true;
    const putLT = {
    lossTypeExpertiseID: this.editLossTypeArray.join()
    };

    this.adjService.putLossType(putLT).subscribe(
    (data: boolean) => {
      if (data) {
        this.loader = false;
        // this.getAdjusterData();
        this.proInformationEvent.emit();
        this.cancelLossType();
        this.dialog.isLoading(false);
        this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_LossType_Expertise} ${this.validationMsg.IH_updated_Success}`, 'success');
      } else {
        this.dialog.isLoading(false);
        this.loader = false;
      }

    }
  );

  }

 public cancelLossType(): void {
    this.editLossTypeFlag = false;
    this.editLossTypeObject = [];
    this.editLossTypeArray = [];

  }

  public editLanguage(): void {

    this.workExperienceCancel();
    this.cancelinsuranceDesignation();
    this.cancelLossType();
    this.cancelEquipments();
    this.editsoftwareKnowledgeObject = [];
    this.editsoftwareKnowledgeFlag = false;
    (this.editLanguageFlag) ? this.editLanguageFlag = false : this.editLanguageFlag = true;
    if (this.editLanguageFlag) {
      this.editLanguageObject = _.cloneDeep(this.publicView.languageViews);
    }
  }




  public saveLanguage(): void {
    this.dialog.isLoading(true);
    this.loader = true;
    const putLG = {
      languages: this.editLanguageObject,
    };
    this.adjService.putLanguage(putLG).subscribe(
    (data: boolean) => {
      if (data) {
        this.loader = false;
        // this.getAdjusterData();
        this.proInformationEvent.emit();
        this.cancelLanguage();
        this.dialog.isLoading(false);
        this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Language} ${this.validationMsg.IH_updated_Success}`, 'success');
      } else {
        this.dialog.isLoading(false);
        this.loader = false;
      }

    }
  );

  }


  public cancelLanguage(): void {
    this.editLanguageFlag = false;
    this.editLanguageObject = [];

  }


  public editWorkExperience(): void {
    this.cancelinsuranceDesignation();
    this.cancelLossType();
    this.editsoftwareKnowledgeObject = [];
    this.editsoftwareKnowledgeFlag = false;
    this.cancelLanguage();
    this.cancelEquipments();

    (this.editworkExperienceFlag) ? this.editworkExperienceFlag = false : this.editworkExperienceFlag = true;
    if (this.editworkExperienceFlag) {
      this.editworkExperienceObject = _.cloneDeep(this.publicView.experienceViews);
      this.editAutoObject = [];
      this.editPropertyObject = [];
         // This loop will seprate the speciality array into auto & property arrays.
      for (const i of this.specialitiesLookup) {
          const modKey = i.key.slice(0, 2);
          if (modKey === 'SA') {
            this.editAutoObject.push(i);
          } else {
            this.editPropertyObject.push(i);
          }
          }
        // This loop will seprate the speciality array into auto & property arrays.
      if (this.userType !== 'CTAD') {
          // Enable-Disable Auto Property
            this.editAutoArray = [];
            this.editAutoObject.forEach((obj: LookupObject) => {
              let ob = {};
              ob =  this.publicView.specialityViews.find((o: SpecialityViews) => o.specialitiesTypeID === obj.key);
              if (ob) {obj.status = true;
                       obj.enable = true; } else {
                obj.status = false;
                obj.enable = true;
              }
              if (obj.status) {
                this.editAutoArray.push(obj.key);
              }
              });
          // Enable-Disable Auto Spec

          // Enable-Disable Property Spec
            this.editPropertyArray = [];
            this.editPropertyObject.forEach((obj: LookupObject) => {
              let ob = {};
              ob =  this.publicView.specialityViews.find((o: SpecialityViews) => o.specialitiesTypeID === obj.key);
              if (ob) {
              obj.status = true;  obj.enable = true; } else {
              obj.status = false;
              obj.enable = true;
              }
              if (obj.status) {
                this.editPropertyArray.push(obj.key);
              }
              });
          // Enable-Disable Property Spec
      } else { this._adjusterWorkExperience(); }
    }
  }


  private _adjusterWorkExperience(): void {
    let check1 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EADP');
    let check2 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EAFA');
    let check3 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EPDA');
    let check4 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EPFA');

    if (check1 === undefined) {check1 = check2; }
    if (check2 === undefined) {check2 = check1; }
    if (check3 === undefined) {check3 = check4; }
    if (check4 === undefined) {check4 = check3; }


    if (check1.experienceYearTypeID === 'ENON' && check2.experienceYearTypeID === 'ENON') {
      this.editAutoArray = [];
      this.editAutoObject.forEach((ele: LookupObject) => {
        ele.enable = false;
        ele.status = false;
        this.noneAutoFlag = true;
      });
    } else {
      this.editAutoArray = [];
      this.editAutoObject.forEach((obj: LookupObject) => {
        let ob = {};
        ob =  this.publicView.specialityViews.find((o: SpecialityViews) => o.specialitiesTypeID === obj.key);
        if (ob) {obj.status = true;
                 obj.enable = true; } else {
         obj.status = false;
         obj.enable = true;
        }
        if (obj.status) {
          this.editAutoArray.push(obj.key);
        }
        });

    }

    if (check3.experienceYearTypeID === 'ENON' && check4.experienceYearTypeID === 'ENON') {
      this.editPropertyArray = [];
      this.editPropertyObject.forEach((ele: LookupObject) => {
        ele.enable = false;
        ele.status = false;
        this.nonePropertyFlag = true;

      });
    } else {
      this.editPropertyArray = [];
      this.editPropertyObject.forEach((obj: LookupObject) => {
        let ob = {};
        ob =  this.publicView.specialityViews.find((o: SpecialityViews) => o.specialitiesTypeID === obj.key);
        if (ob) {
          obj.status = true;  obj.enable = true; } else {
        obj.status = false;
        obj.enable = true;
        }
        if (obj.status) {
          this.editPropertyArray.push(obj.key);
        }
        });
    }
  }

  public workExperienceChange(id: string): void {
    if (this.userType === 'CTAD') {
      const check1 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EADP');
      const check2 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EAFA');
      const check3 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EPDA');
      const check4 = this.editworkExperienceObject.find((o: ExperienceViews) => o.experienceTypeID === 'EPFA');


      if (id.slice(0, 2) === 'EA') {
      if (check1.experienceYearTypeID === 'ENON' && check2.experienceYearTypeID === 'ENON') {
        this.editAutoArray = [];
        this.editAutoObject.forEach((ele: LookupObject) => {
          ele.enable = false;
          ele.status = false;
          this.noneAutoFlag = true;
        });
      } else {
        this.editAutoObject.forEach((ele: LookupObject) => {
          ele.enable = true;
          this.noneAutoFlag = false;
          // ele.status = false;
        });
      }
    }

      if (id.slice(0, 2) === 'EP') {
      if (check3.experienceYearTypeID === 'ENON' && check4.experienceYearTypeID === 'ENON') {
        this.editPropertyArray = [];
        this.editPropertyObject.forEach((ele: LookupObject) => {
          ele.enable = false;
          ele.status = false;
          this.nonePropertyFlag = true;

        });
      } else {
        this.editPropertyObject.forEach((ele: LookupObject) => {
          ele.enable = true;
          this.nonePropertyFlag = false;
          // ele.status = false;
        });
      }
    }
  }
}

  public autoWorkExperienceChange(): void {
    this.editAutoArray = [];
    this.editAutoObject.forEach((obj: LookupObject) => {
      if (obj.status) {
        this.editAutoArray.push(obj.key);
      } else {
      const index =  this.editAutoArray.indexOf(obj.key);
      if (index !== -1) {
           this.editAutoArray.splice(index, 1);
        }
    }
     });
  }

  public propertyWorkExperienceChange(): void {

    this.editPropertyArray = [];
    this.editPropertyObject.forEach((obj: LookupObject) => {
      if (obj.status) {
        this.editPropertyArray.push(obj.key);
      } else {
      const index =  this.editPropertyArray.indexOf(obj.key);
      if (index !== -1) {
           this.editPropertyArray.splice(index, 1);
        }
    }
     });
  }

  public saveWorkExperience(): void {
    this.loader = true;
    this.dialog.isLoading(true);
    const putWE = {
      experiences: this.editworkExperienceObject,
      speciallities: [
        {
          speciallitiesTypeID: this.editAutoArray.join(),
          speciallitiesSubTypeID: 'SSAO'
        },
        {
          speciallitiesTypeID: this.editPropertyArray.join(),
          speciallitiesSubTypeID: 'SSPY'
        }
      ]
    };
    this.adjService.postWorkExperience(putWE).subscribe(
      (data: boolean) => {
        if (data) {
          this.dialog.isLoading(false);
          this.loader = false;
          // this.getAdjusterData();
          this.proInformationEvent.emit();
          this.editworkExperienceFlag = false;
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Work_Experience} ${this.validationMsg.IH_updated_Success}`, 'success');
        } else {
          this.dialog.isLoading(false);
          this.loader = false;
        }
      }
    );
  }


  public workExperienceCancel(): void {
    this.editworkExperienceObject = [];
    this.editworkExperienceFlag = false;
    this.editPropertyObject = [];
    this.editAutoObject = [];
    this.editPropertyArray = [];
    this.editAutoArray = [];

  }

  // Equipments Integration
  public editEquipments(): void {
    this.workExperienceCancel();
    this.cancelLossType();
    this.editsoftwareKnowledgeObject = [];
    this.editsoftwareKnowledgeFlag = false;
    this.cancelLanguage();
    this.editinsuranceDesignationArray = [];


    (this.editEquipmentsFlag) ? this.editEquipmentsFlag = false : this.editEquipmentsFlag = true;
    if (this.editEquipmentsFlag) {
      this.editEquipmentObject = _.cloneDeep(this.equipmentsLookup);
      this.editEquipmentObject.forEach((obj: LookupObject) => {
        let ob: any;
        ob =  this.publicView.equipmentViews.find((o: EquipmentViews) => o.equipmentTypeID === obj.key);
        if (ob) {
          obj.status = true;
          this.editEquipmentArray.push(obj.key);
          if (ob.equipmentTypeID === 'EOTH' && ob.optionNotes.length > 0) {
            this.equipOther = ob.optionNotes;
            this.showOther = true;
          } else {
            this.showOther = false;
          }
        } else {
          obj.status = false;
        }
      });
    }
  }

  public equipmentsChange(): void {
    this.editEquipmentArray = [];
    this.editEquipmentObject.forEach((obj: LookupObject) => {
      if (obj.status) {
        if (obj.key === 'EOTH') { this.showOther = true; }
        this.editEquipmentArray.push(obj.key);
      } else {
      if (obj.key === 'EOTH') { this.equipOther = ''; this.showOther = false; }
      const index =  this.editEquipmentArray.indexOf(obj.key);
      if (index !== -1) {
           this.editEquipmentArray.splice(index, 1);
        }
      }
    });
  }

  public saveEquipments(): void {
    this.mandatoryEquipmentFlag = true;

// mandatory Equipment value Check
    this.editEquipmentObject.forEach((element: LookupObject) => {
      if (element.isMandatory) {
      const index = this.editEquipmentArray.indexOf(element.key);
      if (index > -1) {
        this.mandatoryEquipmentFlag = false;
      }
    }
    });
// mandatory Equipment value Check

if (!this.mandatoryEquipmentFlag) {
    this.dialog.isLoading(true);
    this.loader = true;
    const tempEquipmentsView = [];
    this.editEquipmentArray.forEach(item => {
      tempEquipmentsView.push({
        equipmentTypeID: item,
        optionNotes: item === 'EOTH' ? this.equipOther : ''
      });
    });
    const putID = {
      equipmentsView: tempEquipmentsView
    };
    this.adjService.putEquipments(putID).subscribe(
    (data: boolean) => {
      if (data) {
        this.loader = false;
        // this.getAdjusterData();
        this.proInformationEvent.emit();
        this.cancelEquipments();
        this.dialog.isLoading(false);
        this.dialog.openSnackbar(
          `${this.metaData.IH_AdjusterPage_Equipments} ${this.validationMsg.IH_updated_Success}`, 'success'
        );
      } else {
          this.dialog.isLoading(false);
          this.loader = false;
        }

      }
    );

  }

}

  public cancelEquipments(): void {
    this.editEquipmentsFlag = false;
    this.editEquipmentObject = [];
    this.editEquipmentArray = [];
    this.equipOther = '';
    this.mandatoryEquipmentFlag = false;
  }

  // These functions has been added for the new travel section by Sanket.

  // this will call the state lookup.
  private getLookupData(): void {
    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getStateLookUp().subscribe(
        (data: LookupModel[]) => {
          if (data) {
            const filterState = data.filter((val: LookupModel) => val.key.trim() !== 'US_CA');
            this.stateLookup = filterState;
            this.handleStates(this.publicView.relocateState, this.stateLookup);
            resolve();
          }
          reject();
        });
    }));
  }

  // This function will convert the state key from get Api into their respective vaues.
  private handleStates(stateKey: string, stateLookup: LookupModel[]): void {
    if (stateKey && stateLookup) {
      const stateArray: string[] = [];
      for (const s of stateKey.split(',')) {
        const stateName = this.getValueByKey(s, stateLookup);
        stateArray.push(stateName);
      }
      this.publicView.stateNames = stateArray.join(', ');
    }
  }

  // This function will be callled when user click on edit button of trvel section it will handle edit mode of travel section.
  public editTravelSection(): void {
    const stateKeyArray = this.publicView.isWillingRelocate === true ? this.publicView.relocateState.split(',') : null;
    this.travelEditMode = true;
    this.travelSlider = Object.assign({}, this.travelSlider, {readOnly: false});
    this.travelForm.controls.isWillingRelocate.setValue(this.publicView.isWillingRelocate);
    this.travelForm.controls.relocateState.setValue(stateKeyArray);
  }

  // this function will handel the validation of state selection formcontrol of travel section.
  public handleValidations(): void {
    this.relocateSubscription = this.travelForm.get('isWillingRelocate').valueChanges.subscribe(
      (value: boolean) => {
        if (value === true) {
          this.showStates = true;
          this.travelForm.controls.relocateState.setValidators(Validators.required);
        } else {
          this.travelForm.controls.relocateState.clearValidators();
          this.showStates = false;
          this.travelForm.controls.relocateState.reset();
        }
        this.travelForm.controls.relocateState.updateValueAndValidity();
      }
    );
  }

  // This function will call the save API of travel section.
  public saveTravelDistance(): void {
    if (this.travelForm.invalid) {
      this.travelForm.controls.relocateState.markAllAsTouched();
      return;
    }
    this.dialog.isLoading(true);
    // this.loader = true;
    this.isTravelLoad = true;
    const putID = {
      travelDistance: this.travelValue,
      isWillingRelocate: this.travelForm.value.isWillingRelocate,
      relocateState: this.travelForm.value.isWillingRelocate === true ? this.travelForm.value.relocateState.toString() : '',
    };
    this.adjService.putTravelDistance(putID).subscribe(
      (res: boolean) => {
        if (res) {
          this.publicView.travelDistance = this.travelValue;
          this.publicView.isWillingRelocate = this.travelForm.value.isWillingRelocate;
          this.publicView.relocateState = this.travelForm.value.isWillingRelocate === true ?
                                          this.travelForm.value.relocateState.toString() : '',
          this.dialog.openSnackbar(
            `${this.metaData.IH_AdjusterPage_TravelDistance} ${this.validationMsg.IH_updated_Success}`, 'success'
          );
          this.handleStates(this.publicView.relocateState, this.stateLookup);
          this.travelSlider = Object.assign({}, this.travelSlider, {readOnly: true});
          this.travelEditMode = false;
        }
        this.isTravelLoad = false;
        this.dialog.isLoading(false);
      }
    );
  }

  public resetTravelSection(): void {
    this.travelValue = this.publicView.travelDistance;
    this.travelEditMode = false;
    this.travelSlider = Object.assign({}, this.travelSlider, {readOnly: true});
  }

  public ngOnDestroy(): void {
    this.relocateSubscription.unsubscribe();
  }

  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) {  return filterArr[0].value; }
    return '';
  }
}
