import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DocumentResponse } from './document-reponse.model';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'inde-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentUploadComponent implements OnInit {

  @ViewChild('file', { static: false }) upload: ElementRef;
  @Input() label: string;
  @Input() buttonText = 'Upload';
  @Input() uploadUrl: string;
  @Input() allowedFormats: string[] = [];                     // make sure the extensions are lowercase
  @Input() maxFileSize = 5;
  @Input() fileName: string;
  @Output() public uploadEvent: EventEmitter<any> = new EventEmitter<any>();
  public isloading: boolean;
  private baseUrl: string;
  public error: string;
  public tooltip: string;
  uploadDisableFlag = false;

  // Added by Abhishek Agnihotri to get doc path
  public docPath: string | ArrayBuffer;
  @Output() public docPathEvent: EventEmitter<string | ArrayBuffer> = new EventEmitter<string | ArrayBuffer>();


  constructor(
    private adjusterService: AdjusterService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit() {
    this.tooltip = 'Allowed file formats are ' + this.allowedFormats.join(', ');
  }

  public openWindow(): void {
    this.upload.nativeElement.click();
  }

  public validateDocument(): void {
    this.uploadDisableFlag = true;
    this.fileName = '';
    this.error = '';
    this.uploadButtonClick(null);
    if (this.upload.nativeElement.files.length > 0) {
      const file = this.upload.nativeElement.files;
      const allowedSize = this.maxFileSize * 1024 * 1024;
      if (file[0].size > allowedSize) {
        this.error = `${this.validatorService.validationMessage.IH_Validation_Delete_File_Size} ${this.maxFileSize}MB`;
        this.upload.nativeElement.value = '';
        this.uploadDisableFlag = false;
        return;
      }
      for (const ex of this.allowedFormats) {
        if (file[0].name.toLowerCase().split('.').pop() === ex.split('.').pop()) {
          if (this.uploadUrl) {
            this.uploadDocument();
          } else {
            const formData: FormData = new FormData();
            formData.append('files', file[0], file[0].name);
            const fileNameArr = [];
            fileNameArr.push(file[0].name);
            this.fileName = fileNameArr.join(', ');
            this.uploadButtonClick(formData);
          }
          this.error = '';
          break;
        }
        this.error = this.validatorService.validationMessage.IH_Validation_Delete_File_Format;
        this.uploadDisableFlag = false;
      }
    } else {
      this.uploadDisableFlag = false;
    }
  }

  private uploadDocument(): void {
    this.error = '';
    this.baseUrl = this.adjusterService.baseUrl.command + this.uploadUrl;
    const file = this.upload.nativeElement.files;
    const formData: FormData = new FormData();
    const fileNameArr = [];
    formData.append('files', file[0], file[0].name);
    fileNameArr.push(file[0].name);
    this.fileName = fileNameArr.join(', ');
    this.readDocument(file[0]);
    if (this.fileName.length > 0) {
      this.isloading = true;
      this.adjusterService.uploadDocuments(this.baseUrl, formData).subscribe(
        (docResponse: DocumentResponse) => {
          this.isloading = false;
          if (docResponse) {
            this.uploadDisableFlag = false;
            this.uploadButtonClick(docResponse);
            this.documentPathOutput();
          }
        },
        err => {
          this.isloading = false;
          this.upload.nativeElement.value = '';
          this.fileName = '';
          this.uploadDisableFlag = false;
        }
      );
    }
  }

  uploadButtonClick(event) {
    this.uploadEvent.emit(event);
  }

  public readDocument(file: File): void {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event: Event) => {
      this.docPath = reader.result;
    };
  }

  public documentPathOutput(): void {
    if (this.docPath) {
      this.docPathEvent.emit(this.docPath);
    } else {
      this.docPathEvent.emit(null);
    }
  }

  public reset(): void {
    this.error = '';
    this.fileName = '';
    this.uploadDisableFlag = false;
  }

}
