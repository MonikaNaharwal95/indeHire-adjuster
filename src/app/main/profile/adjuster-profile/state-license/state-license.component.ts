import { Component, OnInit , Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData } from 'src/app/models/carrier-view.model';

export interface StateLicense {
  stateCode: string;
  licenseNo: string;
  licenseExpiryDate: string;
  isAuto: boolean;
  isProperty: boolean;
  licenseStatus: boolean;
  appointmentInformationsViews: [
    {
      companyName: string,
      expirationDate: string
    }
  ];
}
@Component({
  selector: 'inde-state-license',
  templateUrl: './state-license.component.html',
  styleUrls: ['./state-license.component.scss']
})
export class StateLicenseComponent implements OnInit {
  @ViewChild('dialogappt', { static: true }) public dialogRefppt: DialogComponent;
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  public licenseActiveFlag: boolean = true;
  public licenseExpiredFlag: boolean;
  public appointmentData: StateLicense;
  public showStateLicense: boolean = false;
  constructor() { }

  ngOnInit(): void {}

  public clickStateLicense(apptJson: StateLicense): void {
    this.appointmentData = apptJson;
    this.showStateLicense = true;
    this.dialogRefppt.showDialog();

  }

  public closeDialog(): void {
    this.showStateLicense = false;
    this.dialogRefppt.hideDialog();

  }

}
