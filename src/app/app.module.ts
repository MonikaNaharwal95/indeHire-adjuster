import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdjusterService } from './services/adjuster.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigLoader } from './config.load';
import { ConfigService } from './services/config.service';
import { AuthService } from './auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { CrudService } from './services/crud.service';
import { CmsService } from './services/cms.service';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ValidatorService } from './services/validator.service';
import { IndehireAuthGuard } from './auth/auth.guard';
import { TokenInterceptor } from './auth/token.interceptor';
// import { UploadModule } from '@progress/kendo-angular-upload';
import { UnverifiedUserActionComponent } from './unverified-user-action/unverified-user-action.component';
import { DataChangeService } from './services/data-change.service';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SignalRService } from './services/signal-r.service';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { PushNotificationService } from './services/push-notification.service';
import { CrossOriginFallbackComponent } from './cross-origin-fallback/cross-origin-fallback.component';
// import { EditorModule } from '@progress/kendo-angular-editor';
import { GeoLocationService } from './services/geo-location.service';

@NgModule({
  declarations: [
    AppComponent,
    ResetPasswordComponent,
    AuthCallbackComponent,
    UnverifiedUserActionComponent,
    CrossOriginFallbackComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    InputsModule,
    BrowserModule.withServerTransition({ appId: 'IndeHire-server-app' }),
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,
    NotificationModule,
    // UploadModule,
    PDFExportModule,
    DateInputsModule,
    GridModule,
    SortableModule,
    // EditorModule
  ],
  providers: [
    AuthService,
    SignalRService,
    PushNotificationService,
    GeoLocationService,
    IndehireAuthGuard,
    CrudService,
    CmsService,
    ConfigService,
    AdjusterService,
    ValidatorService,
    DataChangeService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      multi: true,
      deps: [ConfigService, AuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
