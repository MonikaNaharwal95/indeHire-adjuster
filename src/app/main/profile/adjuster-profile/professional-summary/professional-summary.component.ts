import { Component, OnInit , Input, EventEmitter, Output} from '@angular/core';
import {DialogService} from '.././../../../services/dialog.service';
import { AdjusterService } from '.././../../../services/adjuster.service';
import { ValidationMessage } from '../../../../models/validation-message.metadata';
import { ValidatorService } from 'src/app/services/validator.service';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData } from 'src/app/models/carrier-view.model';

export interface Summary {
  profileDescription: string;
  profileTitle: string;
}
@Component({
  selector: 'inde-professional-summary',
  templateUrl: './professional-summary.component.html',
  styleUrls: ['./professional-summary.component.scss']
})
export class ProfessionalSummaryComponent implements OnInit {
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  @Output() proSummaryEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loader: boolean = false;
  public summaryObject: Summary = {
    profileDescription: '',
    profileTitle: ''
  };
  public addSummaryFlag: boolean = false;
  public validationMsg: ValidationMessage;

  constructor(
    private adjService: AdjusterService,
    private dialog: DialogService,
    private validatorService: ValidatorService,
  ) { }

  ngOnInit(): void {
    this.validationMsg = this.validatorService.validationMessage;
  }



  public onAddSummary(): void {
    this.summaryObject.profileDescription = this.publicView.profileDescription;
    this.addSummaryFlag = true;
  }

  public postSummary(): void {
    this.dialog.isLoading(true);
    this.loader = true;
    this.summaryObject.profileTitle = this.publicView.profileTitle;
    this.adjService.postSummary(this.summaryObject).subscribe(
      (data: boolean) => {
        if (data) {
          this.loader = false;
          this.proSummaryEvent.emit();
          this.addSummaryFlag = false;
          this.dialog.isLoading(false);
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Professional_Summary}
          ${this.validationMsg.IH_updated_Success}`, 'success');
        } else {
          this.dialog.isLoading(false);
          this.loader = false;
        }

      }
    );
  }
}
