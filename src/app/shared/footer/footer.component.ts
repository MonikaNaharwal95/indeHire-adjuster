import { Component, OnInit } from '@angular/core';
import { AppVersionModel } from 'src/app/models/app-version.model';
import { FooterMetadata } from 'src/app/models/footer.metadata';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';

@Component({
  selector: 'inde-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  metadata!: FooterMetadata;
  policyRoute!: string;
  termsRoute!: string;
  faqRoute!: string;
  appVersion!: string;

  constructor(
    private contentService: CmsService,
    private adjusterService: AdjusterService
  ) { }

  public ngOnInit(): void {
    this.termsRoute = this.contentService.websiteUrl + 'legal-terms/terms-conditions';
    this.policyRoute = this.contentService.websiteUrl + 'legal-terms/privacy-policy';
    this.faqRoute = this.contentService.websiteUrl + 'faqs';
    this.contentService.getMetadata<FooterMetadata>('IH_FootersPage').subscribe(
      (metadata: FooterMetadata) => {
        if (metadata) {
          this.metadata = metadata;
        }
      }
    );
    this.adjusterService.getAppVersion().subscribe(
      (res: AppVersionModel) => {
        if (res) {
          this.appVersion = res.versionNo;
        }
      }
    );
  }

}
