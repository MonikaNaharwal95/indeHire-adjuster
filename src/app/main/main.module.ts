import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarrierViewComponent } from './profile/carrier-view/carrier-view.component';
import { DatePickerModule, DateRangeComponent, DateRangeModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AdjusterProfileComponent } from './profile/adjuster-profile/adjuster-profile.component';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { ProfileCreationComponent } from './profile-creation/profile-creation.component';
import { PersonalInfoComponent } from './profile-creation/personal-info/personal-info.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { ProfessionalInfo1Component } from './profile-creation/professional-info1/professional-info1.component';
import { ProfessionalInfo2Component } from './profile-creation/professional-info2/professional-info2.component';
import { InsuranceDetailComponent } from './forms/insurance-detail/insurance-detail.component';
import { SsnDialogComponent } from './forms/ssn-dialog/ssn-dialog.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
// import { UploadModule } from '@progress/kendo-angular-upload';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingComponent } from './settings/account-setting/account-setting.component';
import { ProfessionalSummaryComponent } from './profile/adjuster-profile/professional-summary/professional-summary.component';
import { ProfessionalInformationComponent } from './profile/adjuster-profile/professional-information/professional-information.component';
import { StateLicenseComponent } from './profile/adjuster-profile/state-license/state-license.component';
import { CertificationsComponent } from './profile/adjuster-profile/certifications/certifications.component';
import { EmploymentHistoryComponent } from './profile/adjuster-profile/employment-history/employment-history.component';
import { EducationComponent } from './profile/adjuster-profile/education/education.component';
import { WorkPreferenceComponent } from './profile/adjuster-profile/work-preference/work-preference.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { JobsComponent } from './jobs/jobs.component';
import { Ng5SliderModule } from 'ng5-slider';
import { JobDetailComponent } from './jobs/job-detail/job-detail.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractDetailComponent } from './contracts/contract-detail/contract-detail.component';
import { ContractListComponent } from './contracts/contract-list/contracts.list.component';
import { ContractOverviewComponent } from './contracts/contract-detail/contract-overview/contract-overview.component';
import { HomePageComponent } from './home-page/home-page.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { LatestUpdateComponent } from './home-page/latest-update/latest-update.component';
import { PaymentTaxesComponent } from './settings/payment-taxes/payment-taxes.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { MailingSytemComponent } from './message-center/mailing-sytem/mailing-sytem.component';
import { ComposeMailComponent } from './message-center/compose-mail/compose-mail.component';
import { NotificationAlertsComponent } from './message-center/notification-alerts/notification-alerts.component';
// import { EditorModule } from '@progress/kendo-angular-editor';
import { CalenderComponent } from './home-page/calender/calender.component';
// import { CisLibModule } from 'cis-schema-renderer';
import { QaFailuresComponent } from './qa-failures/qa-failures.component';
import { EquipmentImageComponent } from './profile/adjuster-profile/professional-information/equipment-image/equipment-image.component';
import { EquipmentViewComponent } from './profile/carrier-view/equipment-view/equipment-view.component';
import { RescheduleDialogComponent } from './forms/reschedule-dialog/reschedule-dialog.component';

@NgModule({
  declarations: [
    MainComponent,
    ToolbarComponent,
    CarrierViewComponent,
    AdjusterProfileComponent,
    ProfileCreationComponent,
    PersonalInfoComponent,
    ProfessionalInfo1Component,
    ProfessionalInfo2Component,
    SsnDialogComponent,
    InsuranceDetailComponent,
    SettingsComponent,
    AccountSettingComponent,
    ProfessionalSummaryComponent,
    ProfessionalInformationComponent,
    StateLicenseComponent,
    CertificationsComponent,
    EmploymentHistoryComponent,
    EducationComponent,
    WorkPreferenceComponent,
    JobsComponent,
    JobDetailComponent,
    ContractsComponent,
    ContractDetailComponent,
    ContractListComponent,
    ContractOverviewComponent,
    HomePageComponent,
    LatestUpdateComponent,
    PaymentTaxesComponent,
    MessageCenterComponent,
    MailingSytemComponent,
    ComposeMailComponent,
    NotificationAlertsComponent,
    CalenderComponent,
    QaFailuresComponent,
    EquipmentImageComponent,
    EquipmentViewComponent,
    RescheduleDialogComponent
  ],
  imports: [
  SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,
    DatePickerModule,
    InputsModule,
    DropDownsModule,
    ProgressBarModule,
    TooltipModule,
    LayoutModule,
    Ng5SliderModule,
    // UploadModule,
    PdfViewerModule,
    DateRangeModule,
    DateInputsModule,
    GridModule,
    SortableModule,
    // EditorModule,

  ],
  providers: [
    DatePipe
  ]
})
export class MainModule { }
