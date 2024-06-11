import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageCenter } from 'src/app/models/message-center.metadata';
import { CmsService } from 'src/app/services/cms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'inde-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit {

  public meta: MessageCenter;
  @ViewChild('lazyLoadAlerts', { static: false }) lazyLoadScroll: ElementRef;

  constructor(
    private cmsService: CmsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMessageCenterMetadata();
  }

  private getMessageCenterMetadata(): void {
    this.cmsService.getMetadata<MessageCenter>('IH_Adjuster_MessageCenter').subscribe(
    (metaData: MessageCenter) => {
        if (metaData) {
          this.meta = metaData;
        }
    });
  }

  public scrollWrap(): void {
    if (this.router.url.split('/').length === 3 && this.router.url.split('/')[2]) {
      const scrollHeight = this.lazyLoadScroll.nativeElement.scrollHeight;
      const clientHeight = this.lazyLoadScroll.nativeElement.clientHeight;
      const scrollTop = this.lazyLoadScroll.nativeElement.scrollTop;
      if ((scrollHeight - clientHeight - 1) < scrollTop) {
        const random = Math.random().toString(36).substring(7);
        this.router.navigate([`/message-center/notifications`], { queryParams: { page: random }});
      }
    }
  }

}
