import { ValidationMessage } from '../../models/validation-message.metadata';
import { UpdatePasswordMetadata } from './../../models/password-reset.metadata';
import { ValidatorService } from './../../services/validator.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { CmsService } from 'src/app/services/cms.service';
import { ActivatedRoute } from '@angular/router';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { IdentityResponse } from 'src/app/models/command-api-res.model';
@Component({
  selector: 'inde-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public changePasswordForm: FormGroup;
  public passwordStatus: number;
  public metadata: UpdatePasswordMetadata;
  public routerKey: string;
  public loader: boolean;
  public validations: ValidationMessage;
  public isDecrypted: boolean = true;
  public isDecryptedConfirm: boolean = true;
  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private cmsService: CmsService,
    private route: ActivatedRoute,
    private adjusterService: AdjusterService
  ) { }

  public get keys(): FormKeysModel {
    return this.changePasswordForm.controls;
  }

  public ngOnInit(): void {
    this.routerKey = this.route.snapshot.params.id;
    this.formInit();
    this.getMetadata();
  }

  // For build form
  private formInit(): void {
    this.changePasswordForm = this.fb.group({
      newPassword: new FormControl('',
        [Validators.required, Validators.minLength(10),
        Validators.pattern(this.validatorService.passwordRegEx)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
      { validator: this.passwordMatchValidator }
    );
  }

  // for get all metadata of reset-password page
  private getMetadata(): void {
    this.cmsService.getMetadata<UpdatePasswordMetadata>('IH_ResetPasswordConfirmationPage').subscribe(
      (metaValue: UpdatePasswordMetadata) => {
        this.metadata = metaValue;
        this.validations = this.validatorService.validationMessage;
      }
    );
  }

  // For reset password
  public resetPassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    const postData: UpdatePasswordModel = {
      key: this.routerKey,
      password: this.changePasswordForm.value.confirmPassword
    };
    this.loader = true;
    this.adjusterService.updateUserPassword(postData).subscribe(
      (response: IdentityResponse) => {
        this.loader = false;
        if (response && !response.isError) {
          this.passwordStatus = 1;
        }
        if (response && response.isError) {
          if (response.message === 'PasswordHistoryError') {
            this.changePasswordForm.setErrors({
              isUsed: true
            });
            this.keys.newPassword.setErrors({
              isUsed: true
            });
            this.keys.confirmPassword.setErrors({
              isUsed: true
            });
          } else {
            this.passwordStatus = 2;
          }
        }
      }
    );
  }

  // Function to set the validator for Mismatc
  private passwordMatchValidator(frm: FormGroup): ValidationErrors {
    if (frm.controls.newPassword.valid && frm.controls.confirmPassword.valid) {
      return frm.controls.newPassword.value === frm.controls.confirmPassword.value ? null : { mismatch: true };
    }
  }
}

export interface UpdatePasswordModel {
  key: string;
  password: string;
}
