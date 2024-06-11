import { ValidationMessage } from '../../models/validation-message.metadata';
import { ValidatorService } from 'src/app/services/validator.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CmsService } from 'src/app/services/cms.service';
import { RequestResetPassword } from 'src/app/models/password-reset.metadata';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { IdentityResponse } from 'src/app/models/command-api-res.model';

@Component({
  selector: 'inde-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss']
})
export class ResetPasswordEmailComponent implements OnInit {

  public sendEmail: FormControl;
  public metadata: RequestResetPassword;
  public isRequested: boolean;
  public loader: boolean;
  public errMsg: string;
  public validations: ValidationMessage;

  constructor(
    private validotorService: ValidatorService,
    private cmsService: CmsService,
    private adjusterService: AdjusterService
  ) { }

  public ngOnInit(): void {
    this.sendEmail = new FormControl('', [Validators.required, Validators.pattern(this.validotorService.emailRegEx)]);
    this.getMetadata();
  }

// For get all metadata of reset-password email page
  private getMetadata(): void {
    this.cmsService.getMetadata<RequestResetPassword>('IH_ResetPasswordPage').subscribe(
      (metaval: RequestResetPassword) => {
        if (metaval) {
          this.metadata = metaval;
          this.validations = this.validotorService.validationMessage;
        }
      }
    );
  }

  public requestResetPassword(): void {
    if (this.sendEmail.invalid) {
      this.sendEmail.markAllAsTouched();
      return;
    }
    this.loader = true;
    this.adjusterService.sendResetPasswordLink(this.sendEmail.value).subscribe(
      (res: IdentityResponse) => {
        this.loader = false;
        if (res && !res.isError) {
          this.isRequested = true;
        }
        if (res && res.isError) {
          this.sendEmail.setErrors({
            notAllowed: true
          });
          this.errMsg = res.message;
        }
      }
    );
  }

}
