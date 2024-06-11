import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {DialogService} from '.././../../../services/dialog.service';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from '.././../../../services/adjuster.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LookupModel, ChildCertficateLookup, CertficateLookup } from 'src/app/models/lookup.model';
import * as _ from 'lodash';
import { DocumentResponse } from '../../../../shared/document-upload/document-reponse.model';
import { LookupService } from '.././../../../services/lookup.service';
import { ValidationMessage } from '../../../../models/validation-message.metadata';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData , CertificationViews} from 'src/app/models/carrier-view.model';
import { DeleteAlert, DeleteCertification } from 'src/app/models/adjuster-profile.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';
export interface EditCertification {
  certificateNumber: string;
  certificationDate: string;
  certificationID: number;
  certificationTypeID: string | string[];
  description: string;
  documentFileName: string;
  documentID: string;
  // documentPath: string;
  documentTypeID: string;
  expirationDate: string;
  hasChild: boolean;
  isParent: boolean;
  parentCertificationID: string;
}


export interface ItemDis {
  dataItem: {
    key: string;
    status: boolean;
    value: string;
  };
  index: number;
}


@Component({
  selector: 'inde-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent implements OnInit {
  @ViewChild('indeAlert', {static: false}) indeAlert;
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  @Output() certificationsEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loader: boolean = false;
  public addCertification: FormGroup;

  public isExpDescExpanded: boolean = false;
  public addCertificationFlag: boolean = false;
  public editCertificationFlag: boolean = false;
  public hideChildCertificate: boolean;
  public isCertificateExpanded: boolean = false;
  public minexpiryDate: Date;
  public maxstartDate: Date;
  public removeCertification: string = '';
  public uploadSaveUrl: string; // should represent an actual API endpoint
  public uploadRemoveUrl: string = 'removeUrl'; // should represent an actual API endpoint
  public deleteItemAlert: DeleteAlert;
  public uploadFileName: string = '';
  public validationMsg: ValidationMessage;
  public certificateLookup: CertficateLookup[] = [];
  public childCertificateLookup: ChildCertficateLookup[] = [];
  public childCertificateList: ChildCertficateLookup[] = [];

  public certificatedefaultItem: { value: string, key: string } = { value: '', key: null };
  public certificatedefaultItem2: { value: string, key: string } = { value: '', key: null };

  public promiseBool: Promise<undefined | string>[] = [];

  constructor(
    private adjService: AdjusterService,
    private cmsService: CmsService,
    private dialog: DialogService,
    private ac: FormBuilder,
    public validatorService: ValidatorService,
    private lookupService: LookupService,
    ) { }

 ngOnInit(): void {
    this.uploadSaveUrl = 'api/FileManager/upload-contractor-certificate';
    this.lookupService.getCertificateTypeLookUp().subscribe((data: CertficateLookup[]) => {     // Parent Certificate Lookup
      this.certificateLookup = data;
    });


    this.lookupService.getChildCertificateLookUp().subscribe((data: ChildCertficateLookup[]) => {    // Child Certificate Lookup
      this.childCertificateLookup = data;
    });

    this.minexpiryDate = this.validatorService.setDate(1);
    this.maxstartDate = this.validatorService.setDate(0);
    this.validationMsg = this.validatorService.validationMessage;
    this.certificatedefaultItem.value = this.metaData.IH_AdjusterPage_Certification_Type;
    this.certificatedefaultItem2.value = this.metaData.IH_AdjusterPage_Child_Certification;
  }


  public onAddCertificate(): void {                                                                // Add Certification
    this.uploadFileName = '';
    this.buildAddCertificationForm();
    this.addCertificationFlag = true;
    this.editCertificationFlag = false;
    this.hideChildCertificate = true;
    this.certificateValidator();
    this.dateValidator();
    this.disableParentCertificate();
  }

 private disableParentCertificate(): void {                                                // Disable Parent Certification Start
  this.certificateLookup.forEach((obj1: CertficateLookup) => {
    obj1.status = false;
    this.publicView.certificationViews.forEach((obj2: CertificationViews) => {
    if ((obj2.parentCertificationID === obj1.key)) {
      obj1.status = true;
    }});
  });
  }


  get cert(): FormKeysModel {
    return this.addCertification.controls;
  }


  public onCertificateUpload($event: DocumentResponse): void {
    if ($event == null) {
      this.cert.documentID.setValue('');
    } else {
      this.cert.documentID.setValue($event.documentID);
    }
  }

  private buildAddCertificationForm(): void {
    this.addCertification = this.ac.group({
      certificateNumber: new FormControl('', [Validators.pattern(this.validatorService.validation3)]),
      certificationDate: new FormControl('', [Validators.required]),
      expirationDate: new FormControl(''),
      documentID: new FormControl('', [Validators.required]),
      childCertificationID: new FormControl(''),
      parentCertificationID: new FormControl('', [Validators.required]),
    });
    this.addCertification.valueChanges.subscribe(
      change => {
        if (change.certificateNumber.trim().length === 0 && change.certificateNumber.trim() !== change.certificateNumber) {
          const trimVal = change.certificateNumber.trim();
          this.addCertification.controls.certificateNumber.setValue(trimVal);
        }
      }
    );
  }

  onEditCertificate(certificateJSON: EditCertification): void {
    this.childCertificateList = [];
    this.uploadFileName = certificateJSON.documentFileName;
    this.childCertificateLookup.forEach((obj: ChildCertficateLookup) => {
      if (obj.parentCertificateCode === certificateJSON.parentCertificationID) {
        this.childCertificateList.push(obj);
        }
    });

    if (certificateJSON.certificationTypeID !== '') {
      this.hideChildCertificate = false;
      certificateJSON.certificationTypeID = (certificateJSON.certificationTypeID as string).split(',');

    } else {
     this.hideChildCertificate = true;
    }
    this.buildEditCertificationForm(certificateJSON);
    this.addCertificationFlag = true;
    this.editCertificationFlag = true;
    this.certificateValidator();
    this.dateValidator();
  }

  private buildEditCertificationForm(certificateJSON: EditCertification): void {

    this.addCertification = this.ac.group({
      certificateNumber: new FormControl(certificateJSON.certificateNumber,  [Validators.pattern(this.validatorService.validation3)]),
      certificationDate: new FormControl(new Date(certificateJSON.certificationDate), [Validators.required]),
      expirationDate: new FormControl((certificateJSON.expirationDate != null) ? new Date(certificateJSON.expirationDate) : ''),
      documentID: new FormControl(certificateJSON.documentID, [Validators.required]),
      childCertificationID: new FormControl(certificateJSON.certificationTypeID),
      certificationID: new FormControl(certificateJSON.certificationID, [Validators.required]),
      parentCertificationID: new FormControl({value: certificateJSON.parentCertificationID, disabled: true}, [Validators.required]),
    });
    this.addCertification.valueChanges.subscribe(
      change => {
        if (change.certificateNumber.trim().length === 0 && change.certificateNumber.trim() !== change.certificateNumber) {
          const trimVal = change.certificateNumber.trim();
          this.addCertification.controls.certificateNumber.setValue(trimVal);
        }
      }
    );

    if (certificateJSON.certificationTypeID !== '') {
      const childCertificationID = this.addCertification.get('childCertificationID');
      childCertificationID.setValidators([Validators.required]);

    }
  }

  get keysCertification(): FormKeysModel {
    return this.addCertification.controls;
  }

  public itemDisabled(itemArgs: ItemDis): boolean {
    if (itemArgs.index === -1) {
      return true;
    } else {
      return itemArgs.dataItem.status;
    }

   }


private certificateValidator(): void {
    const parentCertificationID = this.addCertification.get('parentCertificationID');
    const childCertificationID = this.addCertification.get('childCertificationID');
    //  childCertificationID.setValidators([Validators.required]);

    this.addCertification.controls.parentCertificationID.valueChanges
     .subscribe(value => {
       if (value === null) {
        this.childCertificateList = [];
        this.hideChildCertificate = true;
        childCertificationID.setValidators(null);
        childCertificationID.setValue('');
       } else {
        this.childCertificateList = [];
        this.hideChildCertificate = false;
        this.childCertificateLookup.forEach((obj: ChildCertficateLookup) => {
        if (obj.parentCertificateCode === value) {
          childCertificationID.setValue('');
          this.hideChildCertificate = false;
          this.childCertificateList.push(obj);
          childCertificationID.setValidators([Validators.required]);
          }
          });
        }
       if (this.childCertificateList.length === 0) {
          this.hideChildCertificate = true;
          childCertificationID.setValidators(null);
          childCertificationID.setValue('');
        }

    });
  }



private dateValidator(): void {
    const expirationDate = this.addCertification.get('expirationDate');
    const certificationDate = this.addCertification.get('certificationDate');
    if (certificationDate.value === '') {expirationDate.disable(); } else {
      //  this.minexpiryDate = certificationDate.value;
       expirationDate.enable();
    }
    this.addCertification.controls.certificationDate.valueChanges
     .subscribe(value => {
       if (value === null) {
        expirationDate.disable();
        expirationDate.setValue('');
       } else {
        expirationDate.enable();
        // this.minexpiryDate = value;
        }

    });
  }


public addCertification_func(): void {
    this.dialog.isLoading(true);
    if (this.addCertification.status === 'INVALID') {
      this.addCertification.markAllAsTouched();
      return;
    }
    this.loader = true;
    if (!this.editCertificationFlag) {
    this.adjService.postCertificate(this.addCertification.value).subscribe(
     (data: boolean) => {
       if (data) {
        this.loader = false;
        this.certificationsEvent.emit();
        this.cancelCertification();
        this.dialog.isLoading(false);
        this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Certifications} ${this.validationMsg.IH_added_Success}`, 'success');
       } else {
        this.dialog.isLoading(false);
        this.loader = false;
       }

     }
   );
    } else {
      this.adjService.putCertificate(this.addCertification.getRawValue()).subscribe(
        (data: boolean) => {
          if (data) {
            this.loader = false;
            this.certificationsEvent.emit();
            this.cancelCertification();
            this.dialog.isLoading(false);
            this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Certifications} ${this.validationMsg.IH_updated_Success}`, 'success');
          } else {
            this.loader = false;
            this.dialog.isLoading(false);
          }

        }
      );
    }
 }

private deleteCertificate(): void {
    this.dialog.isLoading(true);
    this.adjService.deleteCertificate(this.deleteItemAlert.obj).subscribe(
    (data: boolean) => {
      if (data) {
      this.certificationsEvent.emit();
      this.indeAlert.close();
      this.cancelCertification();
      this.dialog.isLoading(false);
      this.dialog.openSnackbar(
        `${this.metaData.IH_AdjusterPage_Certifications} ${this.validationMsg.IH_Validation_Delete_Success}`,
        'success'
      );
      } else {
        this.hideAlert();
        this.dialog.isLoading(false);
      }
    });
}


public cancelCertification(): void {
  if (this.editCertificationFlag) {
    const cancelCertification =  _.cloneDeep(this.publicView.certificationViews);
    cancelCertification.forEach((element: EditCertification) => {
      element.certificationTypeID =
      ((typeof element.certificationTypeID) === 'string') ? element.certificationTypeID : (element.certificationTypeID as String[]).join();
  });
  this.publicView.certificationViews = cancelCertification;
}
  this.addCertificationFlag = false;
  this.editCertificationFlag = false;
  this.removeCertification = '';


}


public showAlertBox(objectCert: EditCertification, key2: number): void {
  this.indeAlert.show();
  this.deleteItemAlert = {
    obj: objectCert,
    type: key2
  };

}



public deleteRecord(): void {
  switch (this.deleteItemAlert.type) {
    case 1:
      this.deleteCertificate();
      break;
  }
}

public hideAlert(): void {
  this.indeAlert.close();
}




public getpdfDocument(type: string, json: EditCertification): void {
    this.adjService.getpdfArray(json.documentID, type, json.documentFileName).subscribe((response: ArrayBuffer) => {});
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
