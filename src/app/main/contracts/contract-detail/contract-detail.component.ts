import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataChangeService } from 'src/app/services/data-change.service';
import { CmsService } from 'src/app/services/cms.service';
import { ContractDetailMetaData } from 'src/app/models/contracts.metadata';

@Component({
  selector: 'inde-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss']
})
export class ContractDetailComponent implements OnInit {

  private id: string;
  public assignmentName: string;
  public htmlLoader: boolean = true;
  public contractDetailMetaData: ContractDetailMetaData;

  constructor(
    private cmsService: CmsService,
    private activatedRoute: ActivatedRoute,
    private dataChangeService: DataChangeService
  ) { }

  public ngOnInit(): void {
    this.getMetaData();
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = atob(params.get('id'));
      this.dataChangeService.contractChanged(this.id);
    });
  }

  private getMetaData(): void {
    this.cmsService.getMetadata<ContractDetailMetaData>('IH_Adjuster_Contract_Detail').subscribe (
      (metaData: ContractDetailMetaData) => {
        this.contractDetailMetaData = metaData;
        this.htmlLoader = false;
      }
    );
  }
}
