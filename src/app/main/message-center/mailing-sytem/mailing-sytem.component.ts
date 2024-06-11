import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CmsService } from 'src/app/services/cms.service';
import { MessageCenter } from 'src/app/models/message-center.metadata';
import { AdjusterService } from 'src/app/services/adjuster.service';
import {
  MessageList,
  MessageDetail,
  MessageReply,
} from 'src/app/models/message-center.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'inde-mailing-sytem',
  templateUrl: './mailing-sytem.component.html',
  styleUrls: ['./mailing-sytem.component.scss'],
})
export class MailingSytemComponent implements OnInit {

  public isResponse: boolean;
  public closeMail: boolean;
  public count: number = 0;
  public meta: MessageCenter;
  public list: MessageList[];
  public emailList: MessageList[] = [];
  public inboxEmailList: MessageList[] = [];
  public sentList: MessageList[] = [];
  public detail: MessageDetail;
  private placeHolderType: string;
  private pageIndex: number;
  private pageSize: number;
  private msgSubject: string;
  public categoryName: string;
  public showInbox: boolean = true;
  public sendReply: FormGroup;
  public emailResponse: MessageList;
  private postReply: MessageReply;
  public inboxFirstID: number;
  public sentFirstID: number = null;
  public searchFlag: boolean = null;
  public searchString: string = '';
  public searchKey: string = '';
  public searchMessage: string = '';
  public folderType: string = 'inbox';
  @ViewChild('scrollWrapper', { static: false }) scroller: ElementRef;
  @ViewChild('deleteDialog', { static: true })
  public deleteDialog: AlertDialogComponent;

  public events: string[] = [];
  public value: string = ``;
  public inboxPageNo: number = 1;
  public sentPageNo: number = 1;
  public completePrevPos: number = -1;
  public loadingMail: boolean = false;
  public stopLoadingSent: boolean = false;
  public stopLoadingInbox: boolean = false;
  public searching: boolean = false;

  constructor(
    private cmsService: CmsService,
    private adjService: AdjusterService,
    public dialogService: DialogService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.getMessageCenterMetadata();
    this.getMessageListing();
    this.getSentItems();
    this.sendReply = new FormGroup({
      body: new FormControl(''),
      parentID: new FormControl(''),
    });
  }

  openDialog(): void {
    this.deleteDialog.show();
  }
  closeDialog(): void {
    this.deleteDialog.close();
  }

  private getMessageCenterMetadata(): void {
    this.cmsService
      .getMetadata<MessageCenter>('IH_Adjuster_MessageCenter')
      .subscribe((metaData: MessageCenter) => {
        if (metaData) {
          this.meta = metaData;
        }
      });
  }

  // Delete API
  public deleteMessageConfirmation(): void {
    this.adjService.deleteMessage(this.emailResponse.messageID)
      .subscribe((Response: boolean) => {
        if (Response) {
          this.dialogService.openSnackbar(
            this.meta.IH_Adj_MsgCenter_Delete,
            'success'
          );
          this.closeDialog();
          if (this.folderType === 'inbox') {
            this.inboxPageNo = 1;
            this.inboxEmailList = [];
            this.getMessageListing();
          } else {
            this.sentPageNo = 1;
            this.sentList = [];
            this.getSentItems();
          }
          this.navClicked(this.folderType);
          this.scroller.nativeElement.scrollTop = 0;
        }
      });
  }

  // Post API
  public showEditor(): void {
    this.sendReply.controls.parentID.setValue(this.emailResponse.messageID);
  }

  public submitReply(): void {
    this.adjService.postReply(this.sendReply.value).subscribe((Response: boolean) => {
      if (Response) {
        this.dialogService.openSnackbar(
          this.meta.IH_Adj_MsgCenter_Send,
          'success'
        );
        this.sentPageNo = 1;
        this.sentList = [];
        this.getSentItems();
      }
    });
  }

  // this function will change the email list as user click on the options in navbar.
  public navClicked(type: string): void {
    switch (type) {
      case 'inbox':
        this.showInbox = true;
        this.searchString = '';
        this.folderType = 'inbox';
        if (this.inboxFirstID !== null) {
          this.openMail(this.inboxFirstID);
        }
        break;
      case 'sentbox':
        this.showInbox = false;
        this.searchString = '';
        this.folderType = 'sentbox';
        if (this.sentFirstID !== null) {
          this.openMail(this.sentFirstID);
        }
        break;
    }
  }

  // Inbox API

  private getMessageListing(
    type?: string,
    index?: number,
    size?: number,
    searchKey?: string
  ): void {
    this.placeHolderType = type ? type : 'INBOX';
    index = this.inboxPageNo;
    this.pageSize = size ? size : 50;
    const searchKeyWord = searchKey ? `&searchKey=${searchKey}` : '';
    this.loadingMail = true;
    this.adjService
      .getMessageList(this.placeHolderType, index, this.pageSize, searchKeyWord)
      .subscribe((emailList: MessageList[]) => {
        if (emailList) {
          this.inboxEmailList = this.inboxEmailList.concat(emailList);
          this.loadingMail = false;
          this.searching = false;
          if ((emailList.length % 50) !== 0) {
            this.stopLoadingInbox = true;
          }
          if (emailList.length > 0 && index === 1) {
            this.inboxFirstID = this.inboxEmailList[0].messageID;
            if (this.folderType === 'inbox') {
              this.openMail(this.inboxFirstID);
            }
          }
        }
      });
  }

  // Sentbox API
  private getSentItems(type?: string, index?: number, size?: number, searchKey?: string): void {
    this.placeHolderType = type ? type : 'SENT';
    index = this.sentPageNo;
    this.pageSize = size ? size : 50;
    const searchKeyWord = searchKey ? `&searchKey=${searchKey}` : '';
    this.loadingMail = true;
    this.adjService
      .getMessageList(this.placeHolderType, index, this.pageSize, searchKeyWord)
      .subscribe((emailList: MessageList[]) => {
        if (emailList) {
          this.sentList = this.sentList.concat(emailList);
          this.loadingMail = false;
          this.searching = false;
          if ((emailList.length % 50) !== 0) {
            this.stopLoadingSent = true;
          }
          if (emailList.length > 0 && index === 1) {
            this.sentFirstID = this.sentList[0].messageID;
            if (this.folderType === 'sentbox') {
              this.openMail(this.sentFirstID);
            }
          }
        }
      });
  }
  // API for message Body Content
  private getSubDropdownData(id: number): void {
    this.adjService.getMessageDetail(id).subscribe((data: MessageDetail) => {
      if (data) {
        this.detail = data;
      }
    });
  }

  // This function will be called when user search the mail.
  public searchMail(): void {
    if (this.folderType === 'inbox') {
      this.searching = true;
      this.inboxPageNo = 1;
      this.inboxEmailList = [];
      this.getMessageListing('', null, null, this.searchString);
    } else {
      this.searching = true;
      this.sentPageNo = 1;
      this.sentList = [];
      this.getSentItems('', null, null, this.searchString);
    }
  }

  public getKeys(): void {
    this.searchFlag = true;
  }

  // for refresh userlist after remove text from searchbar
  public removeKeys(): void {
    if (this.searchFlag === true) {
      if (this.searchString.length < 2) {
        this.searchKey = this.searchString;
        if (this.folderType === 'inbox') {
          this.searching = true;
          this.inboxPageNo = 1;
          this.inboxEmailList = [];
          this.getMessageListing('', null, null, '');
        } else {
          this.searching = true;
          this.sentPageNo = 1;
          this.sentList = [];
          this.getSentItems('', null, null, '');
        }
      }
    }
  }

  // isread message API
  private messageRead(id: number): void {
    this.adjService
      .isReadMessage(this.emailResponse.messageID)
      .subscribe((Response: boolean) => {
        if (Response) {
        }
      });
  }

  public openMail(id: number): void {
    this.count = id;
    this.isResponse = false;
    this.emailList = this.folderType === 'inbox' ? this.inboxEmailList : this.sentList;
    for (const email of this.emailList) {
      if (email.messageID === id) {
        this.emailResponse = email;
      }
    }
    if (this.emailList.length !== 0) {
      this.getSubDropdownData(id);
    }
    if (this.emailList.length > 0 && this.emailResponse.isRead === false) {
      this.messageRead(id);
      this.emailResponse.isRead = true;
    }
  }

  public reset(): void {
    this.isResponse = false;
    this.sendReply.reset();
  }

  public sentScrollEvent(): void {
    const scrollHeight = this.scroller.nativeElement.scrollHeight;
    const clientHeight = this.scroller.nativeElement.clientHeight;
    const scrollTop = this.scroller.nativeElement.scrollTop;
    /// this will be called when scroll down
    if ((scrollHeight - clientHeight - 1) < scrollTop) {
      if (!this.loadingMail && !this.stopLoadingSent) {
        this.scroller.nativeElement.scrollTop += 10;
        this.sentPageNo += 1;
        this.getSentItems();
      }
    }
    this.completePrevPos = this.scroller.nativeElement.scrollTop;
  }

  public inboxScrollEvent(): void {
    const scrollHeight = this.scroller.nativeElement.scrollHeight;
    const clientHeight = this.scroller.nativeElement.clientHeight;
    const scrollTop = this.scroller.nativeElement.scrollTop;
    if ((scrollHeight - clientHeight - 1) < scrollTop) {
      if (!this.loadingMail && !this.stopLoadingInbox) {
        this.scroller.nativeElement.scrollTop += 10;
        this.inboxPageNo += 1;
        this.getMessageListing();
      }
    }
    this.completePrevPos = this.scroller.nativeElement.scrollTop;
  }

  public routeToCompose(): void {
    this.router.navigate(['/message-center/inmails/compose-mail']);
  }

}
