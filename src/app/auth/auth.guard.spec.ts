import { TestBed, async, inject } from '@angular/core/testing';

import { IndehireAuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('IndehireAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndehireAuthGuard, Router]
    });
  });

  it('should ...', inject([IndehireAuthGuard], (guard: IndehireAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
