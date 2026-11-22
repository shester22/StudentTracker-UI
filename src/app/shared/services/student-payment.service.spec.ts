import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentPaymentService } from './student-payment.service';
import { environment } from '../../../environments/environment';

describe('StudentPaymentService', () => {
  it('maps the payment list to the API contract and back', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(StudentPaymentService);
    const http = TestBed.inject(HttpTestingController);
    const payments = [{ amount: 50, paymentDate: new Date(2026, 9, 22) }];
    const received = jest.fn();
    service.upsertStudentPayment({ paymentListId: 'list-1', studentId: 'student-1', count: 1, payments }).subscribe(received);
    const request = http.expectOne(`${environment.apiRootUrl}/Student/Payments/upsert`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ id: 'list-1', studentId: 'student-1', count: 1, listItems: payments });
    request.flush({ id: 'list-1', studentId: 'student-1', count: 1, listItems: payments });
    expect(received).toHaveBeenCalledWith({ paymentListId: 'list-1', studentId: 'student-1', count: 1, payments });
    http.verify();
  });
});
