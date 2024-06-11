import { AdjusterService } from './../../../services/adjuster.service';
import { Component, OnInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { CmsService } from 'src/app/services/cms.service';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { LookupModel } from 'src/app/models/lookup.model';
import * as _ from 'lodash';
import { LookupService } from 'src/app/services/lookup.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Options } from 'ng5-slider/options';
import { WorkHistoryData, CarrierViewData, SpecialityViews } from 'src/app/models/carrier-view.model';
import { EquipmentViewComponent } from './../../profile/carrier-view/equipment-view/equipment-view.component';

@Component({
  selector: 'inde-carrier-view',
  templateUrl: './carrier-view.component.html',
  styleUrls: ['./carrier-view.component.scss']
})

export class CarrierViewComponent implements OnInit, OnChanges {
  @ViewChild('addEquipmentImgDialog', {static: false}) public addEquipmentImgDialog: EquipmentViewComponent;
  @ViewChild('scroller', { static: false }) scroller: ElementRef;
  @ViewChild('summary', { static: false }) summary: ElementRef;
  @ViewChild('professionalInfo', { static: false }) professionalInfo: ElementRef;
  @ViewChild('license', { static: false }) license: ElementRef;
  @ViewChild('certification', { static: false }) certification: ElementRef;
  @ViewChild('workHistory', { static: false }) workHistory: ElementRef;
  @ViewChild('experience', { static: false }) experience: ElementRef;
  @ViewChild('education', { static: false }) education: ElementRef;

  public navItem: number = 1;
  private isSidebarUsed: boolean = false;
  public navSubItem: number = 1;
  public renderUI: boolean;
  public profileImg: string = './../../../../assets/default.png';
  public profileImgUrl: SafeUrl;

  // Lookups data integration
  public specialityHeader: LookupModel[] = [];
  public specialityValuesAuto: LookupModel[] = [];
  public specialityValuesProperty: LookupModel[] = [];
  public insuranceDesignation: LookupModel[] = [];
  public lossTypeExpertise: LookupModel[] = [];
  public softwareKnowledge: LookupModel[] = [];
  public language: LookupModel[] = [];
  public availability: LookupModel[] = [];
  public workExperience: LookupModel[] = [];
  public workExperienceYear: LookupModel[] = [];
  public proficiencyValues: LookupModel[] = [];
  public jobPreference: LookupModel[] = [];
  public stateList: LookupModel[] = [];
  public degree: LookupModel[] = [];
  public country: LookupModel[] = [];
  public certificate: LookupModel[] = [];
  public childCertificateList: LookupModel[] = [];
  public equipmentsLookup: LookupModel[] = [];
  public feedbackLookup: LookupModel[] = [];
  public experianceLookup: LookupModel[] = [];
  public stateLookup: LookupModel[] = [];
  public newAddress: string[];
  public expresionCity: string;


  public publicView: CarrierViewData;
  public workHist: WorkHistoryData[] = [];
  public metadata: CarrierViewMetaData;
  public loader: boolean;
  public seeMoreEducation: {};
  public seeMoreWorkExp: {};
  public seeMoreExpAndRating: {};

  // To expand and collapse the cards
  public isWorkExpExpanded: boolean = false;
  public isEducationExpanded: boolean = false;
  public isExpAndRating: boolean = false;
  public isProfessionalInfo: boolean = false;
  public isCertificationExpanded: boolean = false;
  public isLicenseExpanded: boolean = false;

  private promises: Promise<undefined | string>[] = [];
  public autoSpecialityFlag: boolean = false;
  public propertySpecialityFlag: boolean = false;
  public languageShowFlag: boolean = false;

  public travelSlider: Options;
  public travelValue: number;
  public Arr: ArrayConstructor = Array;
  public fillStar: number = 0;
  public emptyStar: number = 5;
  public halfStar: number = 0;

  constructor(
    private adjService: AdjusterService,
    private cmsService: CmsService,
    private lookupService: LookupService,
    private sanitizer: DomSanitizer
  ) { }

  public ngOnInit(): void {
    this.travelSlider = {
      floor: 1,
      ceil: 100,
      readOnly: true,
      showSelectionBar: true,
      translate: (value: number): string => {
        return value + ' ' + 'miles';
      },
    };
    this.getLookupData();
    this.getAdjusterData();
    this.getCarrierViewMetaData();
    this.getWorkHistoryData();
    this.handlePromises();
  }

  public openEquipmentDialog(): void {
    this.addEquipmentImgDialog.openEquipmentDialog();
 }
 public closeEquipmentDialog(): void {
   this.addEquipmentImgDialog.closeEquipmentDialog();
 }

  public handlePromises(): void {
    Promise.all(this.promises)
      .then((res: string[]) => {
        this.loader = true;
        this.renderUI = true;
      })
      .catch((err: string[]) => {
        this.loader = true;
      });
  }

  private getLookupData(): void {

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getExperienceTypeLookUp().subscribe(
        (data: LookupModel[]) => {
          if (data) {
            this.workExperience = data;
            resolve();
          }
          reject();
        });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getExperienceYearLookUp().subscribe(
        (data: LookupModel[]) => {
          if (data) {
            this.workExperienceYear = data;
            resolve();
          }
          reject();
        });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSpecialityTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.specialityValuesAuto = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSpecialitySubTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.specialityValuesProperty = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getInsuranceDesignationLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.insuranceDesignation = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getLossTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.lossTypeExpertise = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getProficiencyTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.proficiencyValues = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getLanguageTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.language = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getSoftwareKnowledgeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.softwareKnowledge = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getJobTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.jobPreference = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getAvailabilityTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.availability = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.stateList = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getDegreeTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.degree = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getCountryLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.country = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getCertificateTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.certificate = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getCertificateTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.certificate = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getAvailabilityTypeLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.availability = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getChildCertificateLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.childCertificateList = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getEquipmentTypeLookup().subscribe((data: LookupModel[]) => {
        if (data) {
          this.equipmentsLookup = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getFeedbackLookUp().subscribe((data: LookupModel[]) => {
        if (data) {
          this.feedbackLookup = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getRequirementType().subscribe((data: LookupModel[]) => {
        if (data) {
          this.experianceLookup = data;
          resolve();
        }
        reject();
      });
    }));

    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getStateLookUp().subscribe(
        (data: LookupModel[]) => {
          if (data) {
            const filterState = data.filter((val: LookupModel) => val.key.trim() !== 'US_CA');
            this.stateLookup = filterState;
            resolve();
          }
          reject();
        });
    }));

  }

  private getAdjusterData(): void {
    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.adjService.getAdjusterProfile().subscribe((adjProfile: CarrierViewData) => {
        if (adjProfile) {
          this.publicView = adjProfile;
          
          this.travelValue = this.publicView.travelDistance;
          this.starRating(this.publicView.starRating);
          if (adjProfile.profileImageID !== '') {
            this.getDocument('preview', this.publicView.profileImageID, 'profile');
          }
          this.seeMoreEducation = false;
          this.seeMoreWorkExp = false;
          this.specialities();
          resolve();
        }

        reject();
      });
    }));

    Promise.all(this.promises)
      .then((result: string[]) => {
          if (this.publicView.relocateState && this.stateLookup) {
            const stateArray: string[] = [];
            for (const s of this.publicView.relocateState.split(',')) {
              const stateName = this.getValueByKey(s, this.stateLookup);
              stateArray.push(stateName);
            }
            this.publicView.stateNames = stateArray.join(', ');
          }
        }).catch((err: string[]) => {
        // this.loading = false;
      });
  }

  validate(item: string): void {
    if (item) {
      const address = item.split(",");
      if (address.length === 4) {
        address.shift();
        this.newAddress = address;
        this.expresionCity = this.newAddress.toString();
      }
    }
  }




  private starRating(rating: string): void {
    const tempStar = parseFloat(rating) - Math.floor(+rating);
    if (tempStar < 0.25) {
      this.fillStar = Math.floor(+rating);
      this.emptyStar = (5 - this.fillStar);
    } else if (tempStar < 0.75 && 0.25 < tempStar) {
      this.fillStar = Math.floor(+rating);
      this.halfStar = 1;
      this.emptyStar = (5 - this.fillStar - this.halfStar);
    } else if (tempStar > 0.75) {
      this.fillStar = Math.floor(+rating) + 1;
      this.emptyStar = (5 - this.fillStar);
    }
  }


  public getDocument(type: string, id: string, name: string): void {
    this.adjService.getpdfArray(id, type, name).subscribe((response: ArrayBuffer) => {
      if (type === 'preview') {
        // this.profileImg = response;
        this.sanitize('data:image/jpg;base64,' + this._arrayBufferToBase64(response));
      }
    });
  }

  // Profile Img Change Starts
  public _arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public sanitize(url: string): void {
    this.profileImgUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }
  // Profile Img Change Ends


  public ngOnChanges(): void {
    this.specialities();
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
      element.specialitiesTypeName = this.getValueByKey(element.specialitiesTypeID , this.specialityValuesAuto) ;
    });
  }

  private getCarrierViewMetaData(): void {
    this.promises.push(new Promise((resolve: Function, reject: Function): void => {
      this.cmsService
        .getMetadata<CarrierViewMetaData>('IH_AdjusterPage')
        .subscribe((carrierMetaData: CarrierViewMetaData) => {
          if (carrierMetaData) {
            this.metadata = carrierMetaData;
            resolve();
          }
          reject();
        });
    }));
  }

  private getWorkHistoryData(): void {
    this.adjService.getWorkHistory().subscribe((workHistoryData: WorkHistoryData[]) => {
      if (workHistoryData) {
        this.workHist = workHistoryData;
        this.seeMoreExpAndRating = false;

        for (let data of this.workHist) {
          this.validate(data.address1);
        }
        for(const row of this.workHist ) {
          

          if (row.feedbackTypeID === 'RROT') {
            row.feedbackTypeName = this.getValueByKey(row.feedbackTypeID, this.feedbackLookup)+
            ' (' + row.feedback + ')';
          } else {
            row.feedbackTypeName = this.getValueByKey(row.feedbackTypeID, this.feedbackLookup)
          }
  
        }
      }
    });
  }

  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) { return filterArr[0].value; }
    return '';
  }

  public scrollList(): void {
    const margin = 32;
    // const div1: number = this.summary.nativeElement.offsetTop;
    const div2: number = this.professionalInfo.nativeElement.offsetTop;
    const div3: number = this.workHistory.nativeElement.offsetTop;
    const div4: number = this.license.nativeElement.offsetTop;
    const div5: number = this.certification.nativeElement.offsetTop;
    const div6: number = this.experience.nativeElement.offsetTop;
    const div7: number = this.education.nativeElement.offsetTop;
    const scrolltop: number = this.scroller.nativeElement.scrollTop;
    if (!this.isSidebarUsed) {
      if (
        scrolltop + this.scroller.nativeElement.clientHeight >=
        this.scroller.nativeElement.scrollHeight
      ) {
        this.navItem = 7;
        return;
      }
      if (scrolltop + margin < div2) {
        this.navItem = 1;
        return;
      }
      if (scrolltop + margin < div3) {
        this.navItem = 2;
        return;
      }
      if (scrolltop + margin < div4) {
        this.navItem = 3;
        return;
      }
      if (scrolltop + margin < div5) {
        this.navItem = 4;
        return;
      }
      if (scrolltop + margin < div6) {
        this.navItem = 5;
        return;
      }
      if (scrolltop + margin < div7) {
        this.navItem = 6;
        return;
      }
    }
  }

  public selectNav(nav: number): void {
    this.isSidebarUsed = true;
    const margin = 32;
    const div1: number = this.summary.nativeElement.offsetTop;
    const div2: number = this.professionalInfo.nativeElement.offsetTop;
    const div3: number = this.workHistory.nativeElement.offsetTop;
    const div4: number = this.license.nativeElement.offsetTop;
    const div5: number = this.certification.nativeElement.offsetTop;
    const div6: number = this.experience.nativeElement.offsetTop;
    const div7: number = this.education.nativeElement.offsetTop;
    switch (nav) {
      case 1:
        this.navItem = nav;
        this.scroller.nativeElement.scrollTop = 0;
        break;
      case 2:
        this.scroller.nativeElement.scrollTop = div2 - margin;
        break;
      case 3:
        this.scroller.nativeElement.scrollTop = div3 - margin;
        break;
      case 4:
        this.scroller.nativeElement.scrollTop = div4 - margin;
        break;
      case 5:
        this.scroller.nativeElement.scrollTop = div5 - margin;
        break;
      case 6:
        this.scroller.nativeElement.scrollTop = div6 - margin;
        break;
      case 7:
        this.scroller.nativeElement.scrollTop = div7 - margin;
        break;
    }
    setTimeout(() => {
      this.isSidebarUsed = false;
    }, 1000);
  }

  public openDocument(path: string): void {
    window.open(path);
  }

}
