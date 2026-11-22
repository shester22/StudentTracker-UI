import { TestBed } from '@angular/core/testing';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  it('can be injected', () => {
    TestBed.configureTestingModule({});
    expect(TestBed.inject(ReportsService)).toBeInstanceOf(ReportsService);
  });
});
