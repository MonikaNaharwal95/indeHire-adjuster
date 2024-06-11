import { LookupModel } from 'src/app/models/lookup.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AdjusterService } from './../../../services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData, SoftwareKnowledgeViews } from 'src/app/models/carrier-view.model';
import { FormBuilder } from '@angular/forms';
import { LookupService } from './../../../services/lookup.service';
import * as _ from 'lodash';
import { ValidationMessage } from '../../../models/validation-message.metadata';
import { DialogService } from './../../../services/dialog.service';
import { DataChangeService } from 'src/app/services/data-change.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PostSummary } from 'src/app/models/adjuster-profile.model';
import { DocumentResponse } from '../../../shared/document-upload/document-reponse.model';
import { GeoLocationService } from 'src/app/services/geo-location.service';
export interface SafeUrlImpl2 {
  SafeUrlImpl: {
    changingThisBreaksApplicationSecurity: string;
  };
}



@Component({
  selector: 'inde-adjuster-profile',
  templateUrl: './adjuster-profile.component.html',
  styleUrls: ['./adjuster-profile.component.scss']
})
export class AdjusterProfileComponent implements OnInit {

  @ViewChild('indeAlert', { static: false }) indeAlert: ElementRef;
  @ViewChild('fileSelect', { static: true }) fileSelect: ElementRef;
  @ViewChild('scroller', { static: false }) scroller: ElementRef;
  @ViewChild('summary', { static: false }) summary: ElementRef;
  @ViewChild('information', { static: false }) information: ElementRef;
  @ViewChild('license', { static: false }) license: ElementRef;
  @ViewChild('certification', { static: false }) certification: ElementRef;
  @ViewChild('experience', { static: false }) experience: ElementRef;
  @ViewChild('education', { static: false }) education: ElementRef;
  @ViewChild('profile', { static: false }) profileCard: ElementRef;
  @ViewChild('workPref', { static: false }) workPrefCard: ElementRef;
  @ViewChild('banner', { static: false }) banner: ElementRef;

  public profileHeight: string = '0px';
  public workPrefHeight: string = '0px';
  public profileSticky: Sticky;
  public workSticky: Sticky;

  public navItem: number = 1;
  public metaData: CarrierViewMetaData;
  public publicView: CarrierViewData;
  public isSidebarUsed: boolean = false;
  public isProfilePic: boolean;
  public editTitleFlag: boolean = false;
  public loader: boolean = false;
  public piSubMenu: boolean = false;
  public isloading: boolean;
  public profileImg: string = './../../../../assets/default.png';
  public profileImgUrl: SafeUrl;
  public navSubItem: number = 1;
  public summaryObject: PostSummary = {
    profileDescription: '',
    profileTitle: ''
  };

  public imageLoader: boolean;
  public stateList: LookupModel[] = [];
  public validationMsg: ValidationMessage;
  public fileURL: string;
  public isDefaultImage: boolean = true;

  constructor(
    private adjService: AdjusterService,
    private cmsService: CmsService,
    private ac: FormBuilder,
    private dialog: DialogService,
    public validatorService: ValidatorService,
    private lookupService: LookupService,
    private dataChangeService: DataChangeService,
    private sanitizer: DomSanitizer,
    private geoLocationService: GeoLocationService
  ) { }

  public ngOnInit(): void {
    this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {                                        // State Lookup
      this.stateList = data;
    });
    this.getAdjusterData();
    this.getCarrierViewMetaData();
    this.profileSticky = {
      position: 'sticky',
      top: '16px'
    };
    this.geoLocationService.requestGeoLocationAccess();
  }

  private getCarrierViewMetaData(): void {                // MetaData for Adjuster Profile Page
    this.cmsService
      .getMetadata<CarrierViewMetaData>('IH_AdjusterPage')
      .subscribe((carrierMetaData: CarrierViewMetaData)  => {
        if (carrierMetaData) {
          this.metaData = carrierMetaData;
          this.validationMsg = this.validatorService.validationMessage;
        }
      });
  }


  public getAdjusterData(): void {                      // Main get Api for Adjuster Profile
    this.adjService.getAdjusterProfile().subscribe((adjProfile: CarrierViewData) => {
      if (adjProfile) {
        this.publicView = adjProfile;
        // To handle Software knowledge other field
        const index =
        this.publicView.softwareKnowledgeViews.findIndex((item: SoftwareKnowledgeViews) => item.softwareKnowledgeTypeID === 'SKOT');
        const other =
        this.publicView.softwareKnowledgeViews.find((item: SoftwareKnowledgeViews) => item.softwareKnowledgeTypeID === 'SKOT');
        this.publicView.softwareKnowledgeViews.splice(index, 1);
        this.publicView.softwareKnowledgeViews.push(other);
        // To handle Software knowledge other field
        if (this.publicView.profileImageID !== '') {
          this.getImage('preview');
          localStorage.removeItem('indehire_profileID');
          localStorage.setItem('indehire_profileID', this.publicView.profileImageID);
        } else {
          this.isloading = true;
        }
      }
    });
  }

  private getImage(type: string): void {
    this.adjService.getpdfArray(this.publicView.profileImageID, type, 'profile').subscribe((response: ArrayBuffer) => {
      if (type === 'preview') {
        this.sanitize('data:image/jpg;base64,' + this._arrayBufferToBase64(response));
        this.isloading = true;
      }
      this.isloading = true;
    });
  }

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
    this.isDefaultImage = false;
  }


  public onTitleEdit(): void {
    this.summaryObject.profileTitle = this.publicView.profileTitle;
    this.editTitleFlag = true;
  }

  public onTitleUpdate(): void {
    this.dialog.isLoading(true);
    this.summaryObject.profileTitle = this.summaryObject.profileTitle.trim();
    this.summaryObject.profileDescription = this.publicView.profileDescription;
    this.adjService.postSummary(this.summaryObject).subscribe(
      (data: boolean) => {
        if (data) {
          this.getAdjusterData();
          this.editTitleFlag = false;
          this.dialog.isLoading(false);
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Title} ${this.validationMsg.IH_updated_Success}`, 'success');
        }
      }
    );
  }

  public scrollList(): void {
    let margin: number;
    if (this.banner) {
      margin = this.banner.nativeElement.clientHeight + 16;
    } else {
      margin = 16;
    }
    this.profileSticky.top = margin + 'px';
    const div2: number = this.information.nativeElement.offsetTop;
    const div3: number = this.license.nativeElement.offsetTop;
    const div4: number = this.certification.nativeElement.offsetTop;
    const div5: number = this.experience.nativeElement.offsetTop;
    const div6: number = this.education.nativeElement.offsetTop;
    const scrolltop: number = this.scroller.nativeElement.scrollTop;

    if (!this.isSidebarUsed) {
      this.piSubMenu = false;
      if (
        scrolltop + this.scroller.nativeElement.clientHeight >=
        this.scroller.nativeElement.scrollHeight
      ) {
        this.navItem = 6;
        return;
      }
      if (scrolltop + margin < div2) {
        this.navItem = 1;
        return;
      }
      if (scrolltop + margin < div3) {
        this.navItem = 2;
        this.piSubMenu = true;
        this.navSubItem = 1;
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
    }
  }

  public selectNav(nav: number): void {
    this.isSidebarUsed = true;
    this.piSubMenu = false;
    let margin: number;
    if (this.banner) {
      margin = this.banner.nativeElement.clientHeight + 16;
    } else {
      margin = 16;
    }
    const div1: number = this.summary.nativeElement.offsetTop;
    const div2: number = this.information.nativeElement.offsetTop;
    const div3: number = this.license.nativeElement.offsetTop;
    const div4: number = this.certification.nativeElement.offsetTop;
    const div5: number = this.experience.nativeElement.offsetTop;
    const div6: number = this.education.nativeElement.offsetTop;
    switch (nav) {
      case 1:
        this.navItem = nav;
        this.navSubItem = 6;
        this.scroller.nativeElement.scrollTop = 0;
        break;
      case 2:
        this.scroller.nativeElement.scrollTop = div2 - margin;
        this.piSubMenu = true;
        this.navSubItem = 1;
        break;
      case 3:
        this.navSubItem = 6;
        this.scroller.nativeElement.scrollTop = div3 - margin;
        break;
      case 4:
        this.navSubItem = 6;
        this.scroller.nativeElement.scrollTop = div4 - margin;
        break;
      case 5:
        this.navSubItem = 6;
        this.scroller.nativeElement.scrollTop = div5 - margin;
        break;
      case 6:
        this.navSubItem = 6;
        this.scroller.nativeElement.scrollTop = div6 - margin;
        break;
    }
    setTimeout(() => {
      this.isSidebarUsed = false;
    }, 1000);
  }

  public openPicChoose(): void {
    document.getElementById('fileLoader').click();
  }

  public validateImage(event: Event): void {
    if ((<HTMLInputElement>event.target).files.length !== 0) {
      const fileExt = (<HTMLInputElement>event.target).files[0].name.toLowerCase().split('.').pop();
      const fileSize = (<HTMLInputElement>event.target).files[0].size;
      const maxSize = 5 * 1024 * 1024;
      if (fileSize > maxSize) {
        this.dialog.openSnackbar(this.metaData.IH_AdjusterPage_FileSizeExceed, 'error');
        (<HTMLInputElement>event.target).value = '';
        return;
      }
      if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
        this.uploadImage(event);
      } else {
        this.dialog.openSnackbar(this.metaData.IH_AdjusterPage_FileFormatNo, 'error');
        (<HTMLInputElement>event.target).value = '';
        return;
      }
    }

  }

  private uploadImage(event: Event): void {
    if ((<HTMLInputElement>event.target).files.length !== 0) {
      this.imageLoader = true;
      this.adjService.uploadProfileImage((<HTMLInputElement>event.target).files)
        .subscribe((data: DocumentResponse) => {
          this.imageLoader = false;
          if (data) {
            // this.profileImg = data.documentPath;
            // this.publicView.profileImageID = data.documentID;

            // this.publicView.documentPath = data.documentPath;
            this.dialog.openSnackbar(`
            ${this.metaData.IH_AdjusterPage_Profile_Picture}
            ${this.validationMsg.IH_updated_Success}`, 'success', 1000);

            this.getAdjusterData();
            this.dataChangeService.setProfileImage(data.documentID);
            this.isProfilePic = true;
          }
          this.imageLoader = false;
        });


    }
  }

  public getValueByKey(key: string, arr: LookupModel[]): string {             // function for calling Lookup Values
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) { return filterArr[0].value; }
    return '';
  }

}


export interface Sticky {
  position: string;
  top: string;
}
