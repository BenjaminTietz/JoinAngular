import { TestBed } from '@angular/core/testing';

import { TaskArraysService } from './task-arrays.service';

describe('TaskArraysService', () => {
  let service: TaskArraysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskArraysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
