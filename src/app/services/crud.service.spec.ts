import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CrudService } from './crud.service';

describe("CrudService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  describe('CrudService', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    }));

    it('should be created', () => {
      const service: CrudService = TestBed.get(CrudService);
      expect(service).toBeTruthy();
    });
  });
});
