import { Injectable } from '@angular/core';
import { CmsService } from './cms.service';
import { LookupModel, ContractorLookupModel } from '../models/lookup.model';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private contentService: CmsService) {}

  public getIndustryLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('industry-type');
  }

  public getContractorLookup(): Observable<ContractorLookupModel[]> {
    return this.contentService.getLookupData('contractor-type');
  }

  // These are the methods for calling lookups of prelim pages.
  public getJobTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('work-types');
  }
  public getStateLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('us-states');
  }
  public getLicenseLookup(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('us-license-states');
  }
  public getExperienceTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('experience-Type');
  }
  public getExperienceYearLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('experience-years-Type');
  }
  public getSpecialitySubTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('specialitiessub-type');
  }
  public getSpecialityTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('specialities-type');
  }
  public getLossTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('Loss-type-expertise');
  }
  public getInsuranceDesignationLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('insurance-designations-type');
  }
  public getSoftwareKnowledgeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor('software-knowledge-type');
  }
  public getLanguageTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('language-type');
  }
  public getEquipmentTypeLookup(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('equipments-type');
  }
  public getProficiencyTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupByContractor(
      'softwareKnowledge-experience-type'
    );
  }
  public getCountryLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('countries');
  }
  public getSignupRefrence(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('signup-types');
  }

  public getDegreeTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('degree-types');
  }

  public getAvailabilityTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('availabilitystatus');
  }

  public getCertificateTypeLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('parent-certification');
  }

  public getChildCertificateLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('child-certification');
  }

  public getJobWeekLookup(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('adjuster-work-week');
  }

  public getRateTypeLookup(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('adjuster-pay-method');
  }

  public getLocationTypeLookup(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('working-way-type');
  }

  public getDurationTypeLookup(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('carrier-work-duration');
  }

  public getRelevanceLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('relevance-sort-type');
  }
  public getWeekWorkLimitLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('adjuster-work-week-limit');
  }
  public getCloseContractReason(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('adjuster-close-contract-reason');
  }
  public getTimesheetStatusLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('timesheet-stages-lookup');
  }
  public getWeekDaysNameLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('weekdays');
  }

  public getAccountType(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('account-types');
  }
  public geTaxPersonType(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('tax-person-types');
  }

  public getRequirementType(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('requirement-type');
  }

  public getFeedbackLookUp(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('client-review-reasons');
  }

  public getPropertyType(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('property-type');
  }

  public getAssignmentStatusType(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('assignment-status-types');
  }

  public terminateReason(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('assignment-terminate-reason');
  }

  public getAssignmentTermination(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('assignment-terminate-reason');
  }

  public getCallingCode(): Observable<LookupModel[]> {
    return this.contentService.getLookupData('country-calling-codes');
  }

}
