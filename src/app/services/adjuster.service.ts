import { ValidatorService } from 'src/app/services/validator.service';
import { ProfileImageResponse } from './../main/toolbar/toolbar.component';
import { IdentityResponse } from './../models/command-api-res.model';
import { XactnetUpdate } from './../models/account-setting.model';
import { CrudService } from './crud.service';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlGroup } from '../models/config.model';
import { UpdatePasswordModel } from '../auth/reset-password/reset-password.component';
import {
  PrelimData,
  PostPrelimModel
} from '../models/prelim-get-data.model';
import { DocumentResponse } from '../shared/document-upload/document-reponse.model';
import {
  AccountSetting,
  PersonalInfoUpdate
} from '../models/account-setting.model';
import { HomePageResultModel, PostHomePagePosition, AssignmentDetail } from '../models/home-page.model';
import {
  PostInsurance, UpdateInsurance, PutSsn, PostSummary, Employment,
  Education, DeleteCertification, Certification, DeleteEmployment,
  Software, Insurance, Equipments, Travel, Losstype,
  Language, WorkExp, ProfileVisibility, PostPerf
} from '../models/adjuster-profile.model';
import { CarrierViewData, WorkHistoryData } from '../models/carrier-view.model';
import { JwtTokenModel } from '../auth-callback/auth-callback.component';
import { DropdownModel, MessageList, MessageDetail, MessageReply, SendComposedMail } from '../models/message-center.model';
import { PaymentAndTaxModel } from '../models/payment-tax.model';
import { LookupModel } from '../models/lookup.model';
import { JobActionModel, JobFiltermodel } from '../models/view-job.model';
import { JobTypeModel } from '../models/jobs.model';
import { AssignmentModel, RescheduleModel, TerminateContractModel } from '../models/contracts.model';
import { ReportApiParams, AssignmentReportModel } from '../models/qa-failure.model';
import { EquipmentImageModel, UploadEquipmentImage } from '../models/equipment.model';
import { AppVersionModel } from '../models/app-version.model';
import { RegistrationContactInfo } from '../models/signup-form.model';


@Injectable({
  providedIn: 'root'
})
export class AdjusterService {

  constructor(
    private configService: ConfigService,
    private crudService: CrudService,
    private validatorService: ValidatorService
  ) { }

  get identityUrl(): UrlGroup {
    return this.configService.getApiUrls('identity');
  }

  get baseUrl(): UrlGroup {
    return this.configService.getApiUrls('adjuster');
  }

  // Do not touch User Authentication Process
  public validateAuth0(body: JwtTokenModel): Observable<IdentityResponse> {
    const url = this.identityUrl.command + `api/Auth/sign-in-token`;
    return this.crudService.postIdentity(url, body);
  }

  // To refresh the token in background
  public refreshToken(refreshData: RefreshBody): Observable<IdentityResponse> {
    const url = this.identityUrl.command + `api/Auth/refreshtoken`;
    return this.crudService.postIdentity(url, refreshData);
  }

  // To Request password change
  public sendResetPasswordLink(emailAddress: string): Observable<IdentityResponse> {
    const body = {
      email: emailAddress
    };
    const url =
      this.identityUrl.command + `api/Auth/forgot-password-send-link`;
    return this.crudService.postIdentity(url, body);
  }

  // To update password
  public updateUserPassword(postData: UpdatePasswordModel): Observable<IdentityResponse> {
    const url = this.identityUrl.command + `api/Auth/update-password`;
    return this.crudService.postIdentity(url, postData);
  }

  // To check if user already exist in IndeHire
  public emailExist(reqestedEmail: string): Observable<IdentityResponse> {
    const url = this.identityUrl.command + `api/Auth/Email-Exist`;
    const postData = {
      email: reqestedEmail
    };
    return this.crudService.postIdentity(url, postData);
  }

  // Resend the verification Email to new user
  public sendVerificationEmail(reqestedEmail: string): Observable<IdentityResponse> {
    const url =
      this.identityUrl.command + `api/Auth/send-verification-email`;
    const postData = {
      email: reqestedEmail
    };
    return this.crudService.postIdentity(url, postData);
  }

  // To check Phone number uniqueness
  public phoneExist(phone: string): Observable<IdentityResponse> {
    const url = this.identityUrl.command + `api/auth/PhoneNumber-Exist`;
    return this.crudService.postIdentity(url, {
      phoneNumber: phone
    });
  }

  public insertUserContactInfo(payload: RegistrationContactInfo): Observable<IdentityResponse> {
    const url = this.identityUrl.command + `api/registration/contractor-registration`;
    return this.crudService.postIdentity(url, payload);
  }

  public getAppVersion(): Observable<AppVersionModel> {
    const url = this.identityUrl.command + `api/General/app-build-version?AppType=website-contractor`;
    return this.crudService.get(url);
  }


  public getAdjusterProfile(): Observable<CarrierViewData> {
    const url = this.baseUrl.read + `api/contractor`;
    return this.crudService.get(url);
  }

  public getHomeData(): Observable<HomePageResultModel> {
    const url = this.baseUrl.read + `api/contractor/home-detail`;
    return this.crudService.get(url);
  }

  public getPrelimData(): Observable<PrelimData> {
    const url = this.baseUrl.read + `api/Preliminary/contractor-preliminary-view`;
    return this.crudService.get(url);
  }

  public postPrelimInfo(payload: PostPrelimModel): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Preliminary/contractor-preliminary';
    return this.crudService.post(url, payload);
  }

  public postHomeData(data: PostHomePagePosition): Observable<boolean> {
    const url = this.baseUrl.command + `api/Contractors/update-home-tiles-index`;
    return this.crudService.put(url, data);
  }

  public postInsuranceData(data: PostInsurance): Observable<boolean> {
    const effectiveDate = this.validatorService.handleTimezone(data.startDate);
    const exiprationDate = this.validatorService.handleTimezone(data.endDate);
    const url =
      this.baseUrl.command +
      `api/Xactanet/PII_Screen/AddInsuranceDetails`;
    let formdata: FormData;
    formdata = data.files;
    formdata.append('insurerName', data.insurerName);
    formdata.append('coverageAmount', data.coverageAmount.toString());
    formdata.append('startDate', effectiveDate);
    formdata.append('endDate', exiprationDate);
    return this.crudService.post(url, formdata);
  }

  public getWorkHistory(): Observable<WorkHistoryData[]> {
    const url = this.baseUrl.read + `api/WorkingHistory`;
    return this.crudService.get(url);
  }

  public putSsnDetails(data: PutSsn): Observable<boolean> {
    // Added as per discussion with Ashwani
    const url = this.baseUrl.command + `api/Xactanet/SSNumber_Update`;
    return this.crudService.put(url, data);
  }

  public postSummary(data: PostSummary): Observable<boolean> {
    const url =
      this.baseUrl.command +
      'api/ProfileSummary/create-contractor-profileSummary';
    return this.crudService.post(url, data);
  }

  public postEmployment(data: Employment): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Contractors/create-contractor-Employment';
    return this.crudService.post(url, data);
  }

  public putEmployment(data: Employment): Observable<boolean> {
    const url =
      this.baseUrl.command +
      'api/Contractors/modify-contractor-employment';
    return this.crudService.put(url, data);
  }

  public postEducation(data: Education): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Education/create-contractor-education';
    return this.crudService.post(url, data);
  }

  public postPreference(data: PostPerf): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Preferences/create-contractor-preferences';
    return this.crudService.post(url, data);
  }

  public putEducation(data: Education): Observable<boolean> {
    const url = this.baseUrl.command +
      'api/Education/modify-contractor-education';
    return this.crudService.put(url, data);
  }

  public postCertificate(data: Certification): Observable<boolean> {
    data.certificationDate = this.validatorService.handleTimezone(new Date(data.certificationDate));
    data.expirationDate = this.validatorService.handleTimezone((data.expirationDate === '') ? null : new Date(data.expirationDate));
    data.childCertificationID = (data.childCertificationID === '') ?
      data.childCertificationID : (data.childCertificationID as string[]).join();
    const url =
      this.baseUrl.command +
      'api/Certificates/create-contractor-Certificates-viewed';
    return this.crudService.post(url, data);
  }

  putCertificate(data: Certification): Observable<boolean> {
    data.certificationDate = this.validatorService.handleTimezone(new Date(data.certificationDate));
    data.expirationDate = this.validatorService.handleTimezone(
      (data.expirationDate === null || data.expirationDate === '') ? null : new Date(data.expirationDate)
    );
    data.childCertificationID =
      (data.childCertificationID === '') ? data.childCertificationID : (data.childCertificationID as string[]).join();
    const url =
      this.baseUrl.command +
      'api/Certificates/modify-contractor-Certificates-viewed';
    return this.crudService.put(url, data);
  }

  deleteEmployment(data: number): Observable<boolean> {
    const tempid = {
      employmentID: data
    };
    const url =
      this.baseUrl.command +
      'api/Contractors/Delete-contractor-employment';
    return this.crudService.put(url, tempid);
  }

  deleteEducation(data: number): Observable<boolean> {
    const tempid = {
      educationID: data
    };
    const url =
      this.baseUrl.command +
      'api/Education/delete-contractor-education';
    return this.crudService.put(url, tempid);
  }

  deleteCertificate(data: DeleteCertification): Observable<boolean> {
    const tempjson = {
      parentCertificationID: data.parentCertificationID,
      childCertificationID: data.certificationTypeID
    };
    const url =
      this.baseUrl.command + 'api/Certificates/Delete_Certificates';
    return this.crudService.put(url, tempjson);
  }

  putSoftwareKnowledge(data: Software): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Contractors/Update_Software_Knowledge';
    return this.crudService.put(url, data);
  }

  putInsuranceDesignation(data: Insurance): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Contractors/Update_Insurance_Designation';
    return this.crudService.put(url, data);
  }

  putEquipments(data: Equipments): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Equipment/update-equipment';
    return this.crudService.put(url, data);
  }

  putTravelDistance(data: Travel): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Equipment/update-travel-distance';
    return this.crudService.put(url, data);
  }

  putLossType(data: Losstype): Observable<boolean> {
    const url =
      this.baseUrl.command + 'api/Contractors/Update_LossType_Expertise';
    return this.crudService.put(url, data);
  }

  putLanguage(data: Language): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Contractors/Language-Update';
    return this.crudService.put(url, data);
  }

  postWorkExperience(data: WorkExp): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Preliminary/ProfessionalInfo';
    return this.crudService.post(url, data);
  }

  putProfileVisibility(data: ProfileVisibility): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Contractors/Update-Profile_Visibility';
    return this.crudService.put(url, data);
  }


  uploadProfileImage(file: FileList): Observable<DocumentResponse> {
    const formData: FormData = new FormData();
    for (let j = 0; j < file.length; j++) {
      formData.append('files', file[j], file[j].name);
    }
    const url = this.baseUrl.command + 'api/FileManager/upload-profile-image';
    return this.crudService.post(url, formData);
  }

  // Gloabal File Upload
  uploadDocuments(
    url: string,
    formData: FormData
  ): Observable<DocumentResponse> {
    return this.crudService.post(url, formData);
  }
  // Gloabal File Upload

  // Account settings
  public getAccountSettings(): Observable<AccountSetting> {
    const url = this.baseUrl.read + 'api/ProfileSetting';
    return this.crudService.get(url);
  }

  public updateProfile(data: PersonalInfoUpdate): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Contractors/contractor-settings';
    return this.crudService.put(url, data);
  }

  public updateInsurance(data: UpdateInsurance): Observable<boolean> {
    const effectiveDate = this.validatorService.handleTimezone(data.effectiveDate);
    const expirationDate = this.validatorService.handleTimezone(data.expirationDate);
    let formdata: FormData;
    formdata = data.files;
    formdata.append('insuranceDetailID', data.insuranceDetailID);
    formdata.append('insurerName', data.insurerName);
    formdata.append('coverageAmount', data.coverageAmount);
    formdata.append('effectiveDate', effectiveDate);
    formdata.append('expirationDate', expirationDate);
    const url =
      this.baseUrl.command +
      `api/Xactanet/ProfileSetting/UpdateInsuranceDetails`;
    return this.crudService.put(url, formdata);
  }

  public addOrUpdateXact(data: XactnetUpdate, isUpdate: boolean): Observable<boolean> {
    if (isUpdate) {
      const url = this.baseUrl.command + 'api/xactanet/update-contractor-xactnet';
      return this.crudService.put(url, data);
    } else {
      const body = {
        xactanetCode: data.xactanetCode,
        xactanetAddress: data.xactanetAddress
      };
      const url = this.baseUrl.command + `api/Xactanet/create-xactanet`;
      return this.crudService.post(url, body);
    }
  }

  public getProfileImage(): Observable<ProfileImageResponse> {
    const url = this.baseUrl.read + 'api/Contractor/ProfileImage';
    return this.crudService.get(url);
  }

  adjusterAgreement(data: string): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Xactanet/AdjusterAcceptAgreement?initial=' + data;
    return this.crudService.post(url);
  }

  getpdfArray(data: string, type: string, name: string): Observable<ArrayBuffer> {
    const url = this.baseUrl.command + 'api/FileManager/' + data;
    return this.crudService.customPDFDowload(url, type, name);
  }

  // Jobs Service
  public acceptJob(id: number): Observable<boolean> {
    const url = this.baseUrl.command + 'api/apply-job';
    return this.crudService.post(url, {
      jobID: id
    });
  }

  public jobFeedback(formData: JobActionModel): Observable<boolean> {
    const url = this.baseUrl.command + 'api/job-like-dislike';
    return this.crudService.post(url, formData);
  }

  public getJobs(status: string, queryParams?: JobFiltermodel): Observable<JobTypeModel[]> {
    const query1 = queryParams.location ? `&location=${queryParams.location}` : '';
    const query2 = queryParams.specialties.length !== 0 ? `&specialties=${queryParams.specialties}` : '';
    const query3 = queryParams.distance ? `&distance=${queryParams.distance}` : '';
    const query4 = queryParams.relevance ? `&relevance=${queryParams.relevance}` : '';
    const url = `${this.baseUrl.read}api/Matched-Job?JobStatusTypeID=${status}${query1}${query2}${query3}${query4}`;
    return this.crudService.get(url);
  }

  public getJobDetailView(id: number): Observable<any> {
    const url = `${this.baseUrl.read}api/Contractor/SBJob/${id}`;
    return this.crudService.get(url);
  }

  public getContracts(type: string): Observable<AssignmentModel[]> {
    const url = `${this.baseUrl.read}api/ContractAssignment/assignment-details/${type}`;
    return this.crudService.get(url);
  }

  public cancelAssignment(payLoad: TerminateContractModel): Observable<boolean> {
    const url = `${this.baseUrl.command}api/Contractors/Withdraw_Apply_Job`;
    return this.crudService.post(url, payLoad);
  }

  // Message Center API
  getDropdownList(): Observable<LookupModel[]> {
    const url = this.baseUrl.read + `api/contact-category-type`;
    return this.crudService.get(url);
  }

  getSubDropdownList(id: number): Observable<LookupModel[]> {
    const url = this.baseUrl.read + `api/message-reference-type/` + id;
    return this.crudService.get(url);
  }

  getMessageList(placeHolderType: string, pageIndex: number, pageSize: number, searchKey?: string): Observable<MessageList[]> {
    const url = this.baseUrl.read +
      `api/email-message-catalogue?placeHolderType=${placeHolderType}&pageIndex=${pageIndex}&pageSize=${pageSize}${searchKey}`;
    return this.crudService.get(url);
  }

  getMessageDetail(id: number): Observable<MessageDetail> {
    const url = this.baseUrl.read + `api/email-message-detail/` + id;
    return this.crudService.get(url);
  }

  public updatePaymentInfo(paymentData: PaymentAndTaxModel): Observable<boolean> {
    const url = this.baseUrl.command + `api/Intacct/Insert-Payment-Information-Intacct`;
    return this.crudService.put(url, paymentData);
  }

  public getPayments(): Observable<PaymentAndTaxModel> {
    const url = this.baseUrl.read + `api/Payment/payment-details`;
    return this.crudService.get(url);
  }

  public postReply(payload: MessageReply): Observable<boolean> {
    const url = this.baseUrl.command + 'api/reply-email-message';
    return this.crudService.post(url, payload);
  }

  public postReschedule(data: RescheduleModel): Observable<boolean> {
    const url = this.baseUrl.command + `api/reschedule-job`;
    return this.crudService.post(url, data);
  }
  public postComposeMail(payload: SendComposedMail): Observable<boolean> {
    const url = this.baseUrl.command + `api/compose-email-message`;
    return this.crudService.post(url, payload);
  }

  public postDismissClick(ID: number): Observable<any> {
    const url = this.baseUrl.command + `api/ContractorAssignment/update-AssignmentRescheduleReadFlag`;
    return this.crudService.post(url, {jobID:ID});
  }
  public isReadMessage(id: number): Observable<boolean> {
    const url = this.baseUrl.command + `api/update-isread-email-message/` + id;
    return this.crudService.put(url, id);
  }
  public deleteMessage(id: number): Observable<boolean> {
    const url = this.baseUrl.command + `api/delete-email-message/` + id;
    return this.crudService.delete(url, id);
  }

  // Assignment Reports - UI
  public getAssignmentReport(params: ReportApiParams): Observable<AssignmentReportModel[]> {
    let url = this.baseUrl.read + `api/assignment-review?statusTypeID=${params.statusTypeID}`;
    const searchParam = params.searchKey.length !== 0 ? `&searchKey=${params.searchKey}` : '';
    const zipParam = params.postalCode ? `&postalCode=${params.postalCode}` : '';
    const clientParam = params.carrierID.length !== 0 ? `&carrierID=${params.carrierID.join(',')}` : '';
    const requimentParam = params.requirementTypeID.length !== 0 ? `&requirementTypeID=${params.requirementTypeID.join(',')}` : '';
    url = url + searchParam + zipParam + requimentParam + clientParam;
    return this.crudService.get(url);
  }

  public getEquipmentDocuments(): Observable<EquipmentImageModel> {
    const url = this.baseUrl.read + 'api/Contractor/equipment-document';
    return this.crudService.get(url);
  }
  public postEquipmentDocument(payload: any): Observable<boolean> {
    const url = this.baseUrl.command + 'api/Contractors/upload-equipment-document';
    return this.crudService.post(url, payload);
  }

}

export interface RefreshBody {
  accessToken: string;
  refreshToken: string;
}
