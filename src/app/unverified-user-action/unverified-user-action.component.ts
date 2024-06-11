import { Component, OnInit } from '@angular/core';
import { AdjusterService } from '../services/adjuster.service';
import { CmsService } from '../services/cms.service';
import { LoginExceptionMetadata } from '../models/login.metadata';

@Component({
  selector: 'inde-unverified-user-action',
  templateUrl: './unverified-user-action.component.html',
  styleUrls: ['./unverified-user-action.component.scss']
})
export class UnverifiedUserActionComponent implements OnInit {

  public email: any;
  public metadata!: LoginExceptionMetadata;

  constructor(
    private cmsService: CmsService
  ) { }

  public ngOnInit(): void {
    this.email = localStorage.getItem('unverifiedUser');
    this.getmetadata();
  }

  private getmetadata(): void {
    this.cmsService.getMetadata<LoginExceptionMetadata>('IH_LoginExceptionPage').subscribe(
      (res: LoginExceptionMetadata) => {
        if (res) {
          this.metadata = res;
        }
      }
    );
  }

}
