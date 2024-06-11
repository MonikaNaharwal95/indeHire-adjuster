import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CmsService } from 'src/app/services/cms.service';
import { ContractListMetaData } from 'src/app/models/contracts.metadata';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookup.model';

@Component({
  selector: 'inde-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  public type: string;
  public status: string;
  public contractMetaData: ContractListMetaData;
  public assignmentStatus: LookupModel[];
  public terminateReasonLookup: LookupModel[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cmsService: CmsService,
    private lookupService: LookupService
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.type = params.get('type');
      this.status = params.get('status');
    });
    this.getMetaData();
    this.getAssignmentType();
  }

  public changeNav(type: string, status: string): void {
    this.router.navigate([`contracts/${type}/${status}`]);
  }

  public getMetaData(): void {
    this.cmsService.getMetadata<ContractListMetaData>('IH_Adjuster_Contract_List').subscribe(
      (metaData: ContractListMetaData) => {
        this.contractMetaData = metaData;
      }
    );
  }

  public getAssignmentType(): void {
    this.lookupService.getAssignmentStatusType().subscribe(
      (res: LookupModel[]) => {
        if (res) {
          this.assignmentStatus = res;
        }
      }
    );
    this.lookupService.terminateReason().subscribe(
      (lookupData: LookupModel[]) => {
        if (lookupData) {
          this.terminateReasonLookup = lookupData;
        }
      }
    );
  }


}
