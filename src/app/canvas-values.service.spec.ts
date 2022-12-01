import { TestBed } from '@angular/core/testing';

import { CanvasValuesService } from './canvas-values.service';

describe('CanvasValuesService', () => {
  let service: CanvasValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
