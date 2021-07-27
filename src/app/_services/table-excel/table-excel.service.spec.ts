import { TestBed } from '@angular/core/testing';

import { TableExcelService } from './table-excel.service';

describe('TableExcelService', () => {
  let service: TableExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
