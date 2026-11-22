import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NgForm } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ReportsService } from '../../shared/services/reports.service';
import { PaymentList } from '../../models/payment.model';
import { PaymentType } from '../../models/payment-type.model';

import { StudentPaymentReportComponent } from './student-payment-report.component';

describe('StudentPaymentReportComponent', () => {
  let component: StudentPaymentReportComponent;
  let fixture: ComponentFixture<StudentPaymentReportComponent>;
  const reportsService = { getPaymentReport: jest.fn(() => of<PaymentList[]>([])) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPaymentReportComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: ReportsService, useValue: reportsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests the payment report for the entered date range', () => {
    component.startDate = '2026-11-01';
    component.endDate = '2026-11-21';
    component.submit({ invalid: false } as NgForm);

    expect(reportsService.getPaymentReport).toHaveBeenCalledWith('2026-11-01', '2026-11-21');
    expect(component.isLoading).toBe(false);
  });

  it('shows the total after a submitted report returns payments and hides it for an empty report', () => {
    const response = new Subject<PaymentList[]>();
    jest.spyOn(reportsService, 'getPaymentReport').mockReturnValueOnce(response);
    component.startDate = '2026-01-01';
    component.endDate = '2026-11-21';
    const footer = () => fixture.nativeElement.querySelector('.report-total') as HTMLElement;
    expect(footer().style.display).toBe('none');

    component.submit({ invalid: false } as NgForm);
    fixture.detectChanges();
    expect(footer().style.display).toBe('none');

    response.next([{
      studentId: '1', studentName: 'Alex', count: 2,
      payments: [
        { amount: 50, paymentDate: new Date(2026, 0, 2) },
        { amount: 40, paymentDate: new Date(2026, 1, 2) }
      ]
    }]);
    response.complete();
    fixture.detectChanges();
    expect(footer().style.display).not.toBe('none');
    expect(footer().textContent).toContain('Total');
    expect(footer().textContent).toContain('$90.00');

    component.submit({ invalid: false } as NgForm);
    fixture.detectChanges();
    expect(footer().style.display).toBe('none');
  });

  it('flattens student payments and sorts by year and month by default', () => {
    reportsService.getPaymentReport.mockReturnValueOnce(of([
      {
        studentId: '1', studentName: 'Alex', count: 2,
        payments: [
          { amount: 50, paymentDate: new Date(2026, 0, 2), forMonth: 1, forYear: 2026, paymentType: PaymentType.Cash },
          { amount: 40, paymentDate: new Date(2025, 11, 2), forMonth: 12, forYear: 2025 }
        ]
      },
      {
        studentId: '2', studentName: 'Sam', count: 1,
        payments: [{ amount: 60, paymentDate: new Date(2026, 1, 2), forMonth: 2, forYear: 2026 }]
      }
    ]));
    component.startDate = '2025-01-01';
    component.endDate = '2026-12-31';
    component.submit({ invalid: false } as NgForm);
    fixture.detectChanges();

    expect(component.payments.data).toHaveLength(3);
    expect(component.payments.data[0]).toMatchObject({ studentName: 'Alex', paymentMethod: 'Cash' });
    const rows = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('tr.mat-mdc-row'));
    expect(rows.map(row => row.querySelector('.mat-column-paymentFor')?.textContent?.trim()))
      .toEqual(['December 2025', 'January 2026', 'February 2026']);

    component.payments.sort!.sort({ id: 'amount', start: 'desc', disableClear: true });
    fixture.detectChanges();
    const sortedRows = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('tr.mat-mdc-row'));
    expect(sortedRows[0].textContent).toContain('Sam');
  });
});
