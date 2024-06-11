import { ValidationMessage } from '../../models/validation-message.metadata';
import { ValidatorService } from 'src/app/services/validator.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';
import { VerificationEmailModel } from 'src/app/models/verification-email.metadata';
import { IdentityResponse } from 'src/app/models/command-api-res.model';

@Component({
  selector: 'inde-send-verification-email',
  templateUrl: './send-verification-email.component.html',
  styleUrls: ['./send-verification-email.component.scss']
})
export class SendVerificationEmailComponent implements OnInit {

  public sendEmail: FormControl;
  public success: string;
  public loader: boolean;
  public metadata: VerificationEmailModel;
  public validationMessage: ValidationMessage;

  constructor(
    private adjusterService: AdjusterService,
    private validotorService: ValidatorService,
    private cmsService: CmsService
  ) { }

  public ngOnInit(): void {
    this.sendEmail = new FormControl('', [Validators.required, Validators.pattern(this.validotorService.emailRegEx)]);
    this.getMetadata();
  }

  // For get metadata of send-varification page
  private getMetadata(): void {
    this.cmsService.getMetadata<VerificationEmailModel>('IH_VerificationEmailPage').subscribe(
      (meta: VerificationEmailModel) => {
        if (meta) {
          this.metadata = meta;
          this.validationMessage = this.validotorService.validationMessage;
        }
      }
    );
  }

  public resendVerificationEmail(): void {
    if (this.sendEmail.invalid) {
      this.sendEmail.markAllAsTouched();
      return;
    }
    this.loader = true;
    this.adjusterService.sendVerificationEmail(this.sendEmail.value).subscribe(
      (res: IdentityResponse) => {
        this.loader = false;
        if (res && !res.isError) {
          if (res && res.result.status) {
            this.success = this.metadata.IH_Verification_Email_Verification_Success;
          } else {
            this.sendEmail.setErrors({
              notfound: true
            });
          }
        }
        if (res && res.isError) {
          this.sendEmail.setErrors({
            notfound: true
          });
        }
      }
    );
  }

}
