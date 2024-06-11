import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { ValidationMockService } from 'src/app/services/mock-validator';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LookupModel } from 'src/app/models/lookup.model';
import { LookupService } from 'src/app/services/lookup.service';
import { NotificationFilterPipe } from 'src/app/shared/pipe/notification-filter.pipe';

class BypassService {
    getMetadata(): Observable<any> {
      return of([]);
    }
    // getHomeData() {
    //   return of([]);
    // }
    // getJobMaster(): Observable<JobLookupModel> {
    //   return of({
    //     carrierDetails: [],
    //     locationDetails: []
    //   });
    // }
  }
class LookupMockService {
    getStateLookUp(): Observable<LookupModel[]> {
      return of([]);
    }
  }
describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            FormsModule,
            DropDownsModule,
            ReactiveFormsModule,
            RouterTestingModule
          ],
          declarations: [ HomePageComponent ],
          providers: [BypassService, NotificationFilterPipe],
          schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(HomePageComponent, {
        set: {
          providers: [
            { provide: CmsService, useClass: BypassService },
            { provide: LookupService, useClass: LookupMockService },
            { provide: ValidatorService, useClass: ValidationMockService },
            { provide: AdjusterService, useClass: BypassService },
          ]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
