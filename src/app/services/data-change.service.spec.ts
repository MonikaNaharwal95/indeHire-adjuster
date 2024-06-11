import { TestBed } from '@angular/core/testing';

import { DataChangeService } from './data-change.service';

describe('DataChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataChangeService = TestBed.get(DataChangeService);
    expect(service).toBeTruthy();
  });
});
