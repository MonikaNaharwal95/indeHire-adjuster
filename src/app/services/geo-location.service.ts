import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CrudService } from './crud.service';
import { Subscription } from 'rxjs';
import { UrlGroup } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  public positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 0
  };
  locationSubscription: Subscription;

  get adjusterEndpoint(): UrlGroup {
    return this.config.getApiUrls('adjuster');
  }

  constructor(
    private config: ConfigService,
    private crudService: CrudService
  ) { }

  public requestGeoLocationAccess(): void {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.watchPosition((position: any) => {
        this.sendLocationToServer(position.coords);
      },
      (posError: any) => {
        switch (posError.code) {
          case 1:
          console.log('Permission Denied');
          break;
          case 2:
          console.log('Position Unavailable');
          break;
          case 3:
          console.log('Timeout');
          break;
        }
      },
      this.positionOptions);
    }
  }

  private sendLocationToServer(coordinates: any): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    const enpoint = this.adjusterEndpoint.command + 'api/ContractorGeoService/geo-services';
    const formData: GeoLocationModel = {
      geo_Latitude: +coordinates.latitude.toFixed(2),
      geo_Longitude: +coordinates.longitude.toFixed(2),
      geo_DeviceTypeID: 'Web'
    };
    this.locationSubscription = this.crudService.put(enpoint, formData).subscribe((response: boolean) => { });
  }

}

export interface GeoLocationModel {
  geo_Latitude: number;
  geo_Longitude: number;
  geo_DeviceTypeID: string;
}
