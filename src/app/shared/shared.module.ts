import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule, DialogsModule } from '@progress/kendo-angular-dialog';
import { FooterComponent } from './footer/footer.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { DialogComponent } from './dialog/dialog.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AccordianComponent } from './accordian/accordian.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { GridComponent } from './grid/grid.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { NotificationFilterPipe } from './pipe/notification-filter.pipe';


@NgModule({
  declarations: [
    AlertDialogComponent,
    FooterComponent,
    DialogComponent,
    DocumentUploadComponent,
    AccordianComponent,
    GridComponent,
    ActionButtonComponent,
    NotificationFilterPipe
  ],
  imports: [
    CommonModule,
    DialogModule,
    DropDownsModule,
    TreeViewModule,
    RippleModule,
    InputsModule,
    LayoutModule,
    TooltipModule,
    GridModule
  ],
  exports: [
    AlertDialogComponent,
    FooterComponent,
    DialogComponent,
    DocumentUploadComponent,
    AccordianComponent,
    GridComponent,
    ActionButtonComponent,
    NotificationFilterPipe
  ]
})
export class SharedModule { }
