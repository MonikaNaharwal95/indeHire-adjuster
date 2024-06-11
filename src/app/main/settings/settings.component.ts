import { ProfileSettingMetadata } from './../../models/profile-settings.metadata';
import { Component, OnInit } from '@angular/core';
import { CmsService } from 'src/app/services/cms.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'inde-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public metaData: ProfileSettingMetadata;

  constructor(
    private contentService: CmsService
  ) { }

  public ngOnInit(): void {
    this.getSettingsMetadata();
  }

  public getSettingsMetadata(): void {
    this.contentService.getMetadata<ProfileSettingMetadata>('IH_AccountSettingsPage').subscribe(
      (metaValue: ProfileSettingMetadata) => {
        if (metaValue) {
          this.metaData = metaValue;
        }
      }
    );
  }

}
