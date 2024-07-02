import { AccountSettingComponent } from './settings/account-setting/account-setting.component';
import { AuthCallbackComponent } from './../auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { CarrierViewComponent } from './profile/carrier-view/carrier-view.component';
import {AdjusterProfileComponent} from './profile/adjuster-profile/adjuster-profile.component';
import { ProfileCreationComponent } from './profile-creation/profile-creation.component';
import { IndehireAuthGuard } from '../auth/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { JobsComponent } from './jobs/jobs.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractListComponent } from './contracts/contract-list/contracts.list.component';
import { ContractOverviewComponent } from './contracts/contract-detail/contract-overview/contract-overview.component';
import { ContractDetailComponent } from './contracts/contract-detail/contract-detail.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PaymentTaxesComponent } from './settings/payment-taxes/payment-taxes.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { MailingSytemComponent } from './message-center/mailing-sytem/mailing-sytem.component';
import { NotificationAlertsComponent } from './message-center/notification-alerts/notification-alerts.component';
import { ComposeMailComponent } from './message-center/compose-mail/compose-mail.component';
import { QaFailuresComponent } from './qa-failures/qa-failures.component';


const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home-page' },
      { path: 'home-page',   component: HomePageComponent },
      { path: 'client-view',   component: CarrierViewComponent },
      { path: 'contractor-profile',  component: AdjusterProfileComponent },
      { path: 'profile-creation', component: ProfileCreationComponent },
      { path: 'qa-report',  component: QaFailuresComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'account-settings' },
          { path: 'account-settings', component: AccountSettingComponent },
          { path: 'payments-taxes', component: PaymentTaxesComponent }
        ]
      },
      { path: 'jobs', component: JobsComponent },
      { path: 'jobs/:notification', component: JobsComponent },
      // { path: 'contracts', pathMatch: 'full', redirectTo: 'contracts/posted-contracts/ASCH', component: ContractsComponent},
      // { path: 'contracts/:type/:status', canActivate: [IndehireAuthGuard], component: ContractsComponent },
      // {
      //   path: 'contracts/:type/:status/:id', component: ContractDetailComponent,
      //   children: [
      //     { path: '', pathMatch: 'full', redirectTo: 'overview' },
      //     { path: 'overview', component: ContractOverviewComponent },
      //   ]
      // },
      {
        path: 'message-center',  component: MessageCenterComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'inmails' },
          {
            path: 'inmails',
            children: [
              { path: '', redirectTo: 'ongoing', pathMatch: 'full' },
              { path: 'ongoing',  component: MailingSytemComponent},
              { path: 'compose-mail',   component: ComposeMailComponent},
            ]
          },
          { path: 'notifications', component: NotificationAlertsComponent }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
RouterModule.forChild(mainRoutes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }