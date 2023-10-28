import { TestBed } from '@angular/core/testing';

import { RemotestorageService } from './remotestorage.service';

describe('RemotestorageService', () => {
  let service: RemotestorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemotestorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
