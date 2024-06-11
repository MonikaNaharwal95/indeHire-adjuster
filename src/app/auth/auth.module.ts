import { RippleModule } from '@progress/kendo-angular-ripple';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ResetPasswordEmailComponent } from './reset-password-email/reset-password-email.component';
import { SharedModule } from '../shared/shared.module';
import { SendVerificationEmailComponent } from './send-verification-email/send-verification-email.component';


const authRoutes: Routes = [
  { path: '', pathMatch : 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'email-verification', component: EmailConfirmationComponent },
  { path: 'forget-password', component: ResetPasswordEmailComponent },
  { path: 'request-verification-email', component: SendVerificationEmailComponent}
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    EmailConfirmationComponent,
    ResetPasswordEmailComponent,
    SendVerificationEmailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(authRoutes),
    ReactiveFormsModule,
    FormsModule,
    InputsModule,
    DropDownsModule,
    TreeViewModule,
    RippleModule
  ]
})
export class AuthModule { }
