import { TestBed } from '@angular/core/testing';

import { PictureDoneService } from './picture-done.service';

describe('PictureDoneService', () => {
  let service: PictureDoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PictureDoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
