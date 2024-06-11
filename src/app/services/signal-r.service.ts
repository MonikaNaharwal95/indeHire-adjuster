import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigService } from './config.service';
import { UrlGroup } from '../models/config.model';
import { CrudService } from './crud.service';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(
    private configService: ConfigService,
    private crudService: CrudService
  ) {
  }

  get notificationUrl(): UrlGroup {
    return this.configService.getApiUrls('notification');
  }

  get loginToken(): string {
    return localStorage.getItem('indehire-api-token');
  }

  public connection: signalR.HubConnection;

  public establishConnection(): Promise<signalR.HubConnection> {
    return new Promise((resolve, reject) => {
      const url =  this.notificationUrl.command + 'api/notification/get-connection';
      this.crudService.postIdentity(url, null).subscribe(
        endpoint => {
          if (endpoint) {
            this.connection = new signalR.HubConnectionBuilder().withUrl(
            endpoint.result + 'Token=' + this.loginToken + '&UserType=Contractor',
            {
              transport: 1,
            })
            .withAutomaticReconnect()
            .build();

            this.connection.start()
            .then(() => {
              resolve(this.connection);
              this.connection.invoke('GetReceiverMessage', 'Contractor');
            }).catch(() => {
              reject();
            });
          }
        }
      );
    });
  }

}

