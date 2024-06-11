import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { CmsService } from './cms.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: CmsService = TestBed.get(CmsService);
    expect(service).toBeTruthy();
  });
});
