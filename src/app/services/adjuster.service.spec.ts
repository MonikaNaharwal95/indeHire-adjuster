import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { AdjusterService } from './adjuster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdjusterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: AdjusterService = TestBed.get(AdjusterService);
    expect(service).toBeTruthy();
  });
});
