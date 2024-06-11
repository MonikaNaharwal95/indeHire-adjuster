import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MessageCenter } from 'src/app/models/message-center.metadata';
import { Location } from '@angular/common';
import { CmsService } from 'src/app/services/cms.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DropdownModel, SendComposedMail } from 'src/app/models/message-center.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { LookupModel } from 'src/app/models/lookup.model';
import { Subscription } from 'rxjs';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { DialogService } from 'src/app/services/dialog.service';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Keys } from '@progress/kendo-angular-common';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'inde-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss']
})
export class ComposeMailComponent implements OnInit, OnDestroy {

  public meta: MessageCenter;
  public dropdownItems: LookupModel[];
  public subDropdownItems: LookupModel[];
  public composeMailForm: FormGroup;
  public validationMsg: ValidationMessage;
  public events: string[] = [];
  public categoryDefault: { value: string, key: string };
  public assignmentDefault: { value: string, key: number };
  public formSubscription: Subscription;
  public value: string = ``;
  public showAssignment: boolean;
  public showSubCategory: boolean;
  public showJobId: boolean;
  public sendingMail: boolean;
  public showContractorCheckbox: boolean;
  public sendMail: SendComposedMail;

  constructor(
    private cmsService: CmsService,
    private adjService: AdjusterService,
    private fb: FormBuilder,
    public dialogService: DialogService,
    private validatorService: ValidatorService,
    private _location: Location
  ) { }

  public get keys(): FormKeysModel {
    return this.composeMailForm.controls;
  }

  ngOnInit(): void {
    this.getDropdownData();
    this.composeMailFb();
  }

  private getMessageCenterMetadata(): void {
    this.cmsService.getMetadata<MessageCenter>('IH_Adjuster_MessageCenter').subscribe(
    (metaData: MessageCenter) => {
        if (metaData) {
          this.meta = metaData;
          this.valueChange();
          this.categoryDefault = { value : this.meta.IH_Adjuster_MessageCenter_Select_Category , key: ''};
          this.assignmentDefault = { value : this.meta.IH_Adj_MsgCenter_SelectID, key: null};
          this.validationMsg = this.validatorService.validationMessage;
        }
    });
  }

  private getDropdownData(): void {
    this.adjService.getDropdownList().subscribe(
      (response: LookupModel[]) => {
          if (response.length > 0) {
            // tslint:disable-next-line: typedef
            const categoryItems = response.filter(item => item.value !== 'Jobs');
            this.dropdownItems = categoryItems;
        }
      }
    );
  }

  private getSubDropdownData(id: number): void {
    this.adjService.getSubDropdownList(id).subscribe(
      (response: LookupModel[]) => {
          this.subDropdownItems = response;
        }
    );
  }

  private composeMailFb(): void {
    this.composeMailForm = this.fb.group({
      contactCategoryID: new FormControl('', (Validators.required)),
      refID: new FormControl(0, (Validators.required)),
      isAddcontractor: new FormControl(false),
      subject: new FormControl('', (Validators.required)),
      body: new FormControl('', (Validators.required)),
      parentID: new FormControl('')
    });
    this.getMessageCenterMetadata();
  }

  public valueChange(): void {
    const refIdControl = this.composeMailForm.get('refID');
    this.formSubscription = this.composeMailForm.get('contactCategoryID').valueChanges.subscribe(
      (categoryId: number) => {
        refIdControl.reset();
        categoryId === 3 ? this.showContractorCheckbox = true : this.showContractorCheckbox = false;
        if (categoryId === 3 || categoryId === 4 || categoryId === 5) {
          this.showSubCategory = true;
          this.keys.refID.setValidators(Validators.required);
          this.getSubDropdownData(categoryId);
        }
        if (categoryId !== 3 && categoryId !== 4 && categoryId !== 5 ) {
        this.showSubCategory = false;
        this.keys.refID.clearValidators();
        if (categoryId !== 0) {
           this.keys.refID.setValue(0);
          }
        }
        refIdControl.updateValueAndValidity();
      }
    );
  }

  public sendEmail(): void {
    if (this.composeMailForm.invalid) {
      this.composeMailForm.markAllAsTouched();
      return;
    }
    this.sendingMail = true;
    this.composeMailForm.controls.parentID.setValue(0);
    this.adjService.postComposeMail(this.composeMailForm.value).subscribe(
      (response: boolean) => {
        this.sendingMail = false;
        if (response) {
        this.dialogService.openSnackbar(this.meta.IH_Adjuster_MessageCenter_Email_Sent, 'success');
        this.composeMailForm.reset();
        this._location.back();
      }
      }
    );
  }
  public ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

}
