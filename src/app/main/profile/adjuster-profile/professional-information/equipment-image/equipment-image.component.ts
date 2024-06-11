import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DialogService } from 'src/app/services/dialog.service';
import { LookupModel } from 'src/app/models/lookup.model';
import { LookupService } from 'src/app/services/lookup.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DocumentResponse } from 'src/app/shared/document-upload/document-reponse.model';
import { EquipmentViews } from 'src/app/models/carrier-view.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { EquipmentImageModel, EquipmentDocumentTypeModel, UploadEquipmentImage } from 'src/app/models/equipment.model';
import { EquipmentDocumentModel } from './../../../../../models/equipment.model';
import { EquipmentMetadata } from 'src/app/models/equipment.metadata';
import { CmsService } from 'src/app/services/cms.service';

@Component({
  selector: 'inde-equipment-image',
  templateUrl: './equipment-image.component.html',
  styleUrls: ['./equipment-image.component.scss']
})
export class EquipmentImageComponent implements OnInit {

  constructor(
    private dialog: DialogService,
    private lookupService: LookupService,
    private adjusterService: AdjusterService,
    private cmsService: CmsService,
  ) { }
  public equipmentsLookup: LookupModel[] = [];
  public uploadSaveUrl: string;
  public uploadFileName: string = '';
  public equipmentList: EquipmentDocumentTypeModel[];
  @ViewChild('equipmentPictureDialog', { static: false }) public equipmentPictureDialog: DialogComponent;
  public equipmentPayload: UploadEquipmentImage;
  public isLoader: boolean = true;
  private equipmentID: EquipmentDocumentTypeModel[];
  private documentType: EquipmentDocumentModel[];
  public meta: EquipmentMetadata;
  public message: string;
  private isImageUploaded: boolean = false;
  public showError: boolean = false;

  ngOnInit(): void {
    this.uploadSaveUrl = 'api/FileManager/upload-document-sas-uri';
    this.getEquipmentDcouments();
    this.getEquipmentLookupData();
    this.getEquipmentMetadata();
  }
  // Get API
  public getEquipmentDcouments(): void {
    this.adjusterService.getEquipmentDocuments().subscribe(
      (res: EquipmentImageModel) => {
        if (res) {
          this.equipmentList = res.equipments;
          this.getEquipmentLookupData().then(
             (lookup: LookupModel[]) => {
              this.equipmentList.forEach((equip: any) => {
                equip.equipmentName = this.getValueByKey(equip.equipmentTypeID, this.equipmentsLookup);
                equip.isChecked = equip.equipmentDocuments.length > 0 ? true : false;
              });
             }
          );
        }
          this.isLoader = false;
        });
      }
  // Lookup data API
  private getEquipmentLookupData(): Promise<LookupModel[]> {
    return new Promise((resolve, reject) => {
    this.lookupService.getEquipmentTypeLookup().subscribe((data: LookupModel[]) => {
      if (data) {
        this.equipmentsLookup = data;
        resolve(this.equipmentsLookup);
      }
      reject();
    });
   });
  }

  public openEquipmentDialog(): void {
    this.equipmentPictureDialog.showDialog();
  }
  public closeEquipmentDialog(): void {
    this.equipmentPictureDialog.hideDialog();
    this.showError = false;
  }

  public removeImage(index: number, doc): void {
    doc.splice(index, 1);
  }
  private getEquipmentMetadata(): void {
    this.cmsService.getMetadata<EquipmentMetadata>('IH_EquipImgUpload').subscribe(
    (metaData: EquipmentMetadata) => {
        if (metaData) {
          this.meta = metaData;
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

  public addEquipmentImage(ID: string): void {
    const selectedRow = this.equipmentList.find(item => item.equipmentTypeID ===  ID);
    selectedRow.equipmentDocuments.push({
      documentID: '',
      documentPath: '',
      documentFileName: ''
    });
  }

  public setDocPath(event: Event, doc): void {
    doc.documentPath = event;
  }

  public setDocID(event: DocumentResponse, doc): void {
    doc.documentID = event.documentID;
    doc.documentFileName = event.documentDescription;
  }

  // Post API
  public UploadEquipment(): void {
    const payload: UploadEquipmentImage[] = [];
    for (const list of this.equipmentList) {
      const docArray: string[] = [];
      list.equipmentDocuments.forEach((item: EquipmentDocumentModel) => {
        if (item.documentID) {
          docArray.push(item.documentID);
        }
      });
      payload.push({
        equipmentTypeID: list.equipmentTypeID,
        documentID: docArray.join(',')
      });
      if (this.isImageUploaded === true) {
        break;
      }
      if (list.equipmentDocuments.length != 0) {
        this.isImageUploaded = true;
      }
    }
    if (this.isImageUploaded === false) {
      this.showError = true;
        return;
    }
    const formData = {
      equipments: payload
    };
    this.adjusterService.postEquipmentDocument(formData).subscribe(
      (response: boolean) => {
        if (response) {
          this.dialog.openSnackbar(this.meta.IH_EquipImgUpload_EqpUpldSuccess, 'success');
          this.closeEquipmentDialog();
        }
      }
    );
   }
 }