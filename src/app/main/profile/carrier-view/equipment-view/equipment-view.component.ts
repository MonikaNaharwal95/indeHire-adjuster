import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DialogService } from 'src/app/services/dialog.service';
import { LookupModel } from 'src/app/models/lookup.model';
import { LookupService } from 'src/app/services/lookup.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DocumentResponse } from 'src/app/shared/document-upload/document-reponse.model';
import { EquipmentViews } from 'src/app/models/carrier-view.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { EquipmentImageModel, EquipmentDocumentTypeModel, UploadEquipmentImage } from 'src/app/models/equipment.model';
import { EquipmentMetadata } from 'src/app/models/equipment.metadata';
import { CmsService } from 'src/app/services/cms.service';

@Component({
  selector: 'inde-equipment-view',
  templateUrl: './equipment-view.component.html',
  styleUrls: ['./equipment-view.component.scss']
})
export class EquipmentViewComponent implements OnInit {

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
  @ViewChild('equipmentPictureViewDialog', { static: false }) public equipmentPictureViewDialog: DialogComponent;
  public equipmentPayload: UploadEquipmentImage;
  public isLoader: boolean = true;
  public meta: EquipmentMetadata;
  public message: string;

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
  // // Lookup data API
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
    this.equipmentPictureViewDialog.showDialog();
  }
  public closeEquipmentDialog(): void {
    this.equipmentPictureViewDialog.hideDialog();
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
}
