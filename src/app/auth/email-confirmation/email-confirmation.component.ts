import { ValidatorService } from 'src/app/services/validator.service';
import { Component, OnInit } from '@angular/core';
import { CmsService } from 'src/app/services/cms.service';
import { EmailVerificationMetaData } from 'src/app/models/email-verification.metadata';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { Router } from '@angular/router';
import { IdentityResponse } from 'src/app/models/command-api-res.model';

@Component({
  selector: 'inde-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  public email: string;
  public metaData: EmailVerificationMetaData;
  public success: string;
  public loader: boolean;

  constructor(
    private cmsService: CmsService,
    private adjusterService: AdjusterService,
    private validationService: ValidatorService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.email = sessionStorage.getItem('userID');
    if (this.validationService.emailVerGuard) {
      this.getMetaData();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  private getMetaData(): void {
    this.cmsService.getMetadata<EmailVerificationMetaData>('IH_EmailVerificationPage').subscribe(
      (metadata: EmailVerificationMetaData) => {
        this.metaData = metadata;
      }
    );
  }

  public resendVerificationEmail(): void {
    this.loader = true;
    this.adjusterService.sendVerificationEmail(this.email).subscribe(
      (response: IdentityResponse) => {
        this.loader = false;
        if (response && !response.isError) {
          this.success = this.metaData.IH_Email_Verification_Email_Sent_Successfully;
        }
      }
    );
  }

}
