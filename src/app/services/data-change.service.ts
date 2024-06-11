import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, Observer } from 'rxjs';
import { MessageCenter } from '../models/message-center.metadata';

@Injectable({
  providedIn: 'root'
})
export class DataChangeService {

  private profileUpdate: Subject<string> = new BehaviorSubject<string>(undefined);
  public profileUpdate$: Observable<string> = this.profileUpdate.asObservable();
  private toolbarPerms: Subject<boolean> = new BehaviorSubject<boolean>(undefined);
  public toolbarPerms$: Observable<boolean> = this.toolbarPerms.asObservable();
  private contractChange: Subject<string> = new BehaviorSubject<string>(null);
  public contractChange$: Observable<string> = this.contractChange.asObservable();
  private agreementCheck: Subject<boolean> = new BehaviorSubject<boolean>(null);
  public agreementCheck$: Observable<boolean> = this.agreementCheck.asObservable();

  private messageCenterMetadata: Subject<MessageCenter> = new BehaviorSubject<MessageCenter>(null);
  public messageCenterMetadata$: Observable<MessageCenter> = this.messageCenterMetadata.asObservable();

  constructor() { }

  public setToolbarPerms(): void {
    this.toolbarPerms.next(true);
  }

  public contractChanged(id: string): void {
    this.contractChange.next(id);
  }

  public setProfileImage(profileLocation: string): void {
    this.profileUpdate.next(profileLocation);
  }

  public setMessageCenter(IH_Adjuster_MessageCenter: any): void {
    this.messageCenterMetadata.next(IH_Adjuster_MessageCenter);
  }

  public setAgreementCheck(status: boolean): void {
    this.agreementCheck.next(status);
  }

}
