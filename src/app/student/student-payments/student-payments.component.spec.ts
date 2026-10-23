import { Subject, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { StudentPaymentsComponent } from './student-payments.component';
import { StudentPaymentService } from '../../shared/services/student-payment.service';
import { Student } from '../../models/student.model';
import { StudentService } from '../../shared/services/student.service';
import { PaymentList } from '../../models/payment.model';

describe('StudentPaymentsComponent', () => {
  let component: StudentPaymentsComponent;
  let service: jasmine.SpyObj<StudentPaymentService>;
  let form: NgForm;
  let studentService: jasmine.SpyObj<StudentService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('StudentPaymentService', ['upsertStudentPayment']);
    studentService = jasmine.createSpyObj<StudentService>('StudentService', ['UpsertStudent']);
    component = new StudentPaymentsComponent(service, studentService);
    component.student = Object.assign(new Student(), {
      studentId: 'student-1', paymentListId: 'list-1',
      duesPayments: [{ paymentId: 'old-1', amount: 40, paymentDate: new Date(2026, 8, 1) }]
    });
    component.paymentDate = new Date(2026, 9, 23);
    component.amount = 50;
    component.forMonth = 10;
    component.forYear = 2026;
    form = { invalid: false, resetForm: jasmine.createSpy('resetForm'), control: { markAllAsTouched: jasmine.createSpy('markAllAsTouched') } } as unknown as NgForm;
  });

  it('preserves existing payments and updates the table only after saving', () => {
    const response = new Subject<PaymentList>();
    service.upsertStudentPayment.and.returnValue(response);
    component.addPayment(form);
    const request = service.upsertStudentPayment.calls.mostRecent().args[0];
    expect(request.paymentListId).toBe('list-1');
    expect(request.payments[0].paymentId).toBe('old-1');
    expect(request.payments[1].amount).toBe(50);
    expect(request.payments[1].forMonth).toBe(10);
    expect(component.student!.duesPayments.length).toBe(1);
    component.addPayment(form);
    expect(service.upsertStudentPayment).toHaveBeenCalledTimes(1);
    response.next(request);
    expect(component.paymentData.length).toBe(2);
    expect(component.student!.lastPaidDues).toEqual(new Date(2026, 9, 23));
    expect(form.resetForm).toHaveBeenCalled();
    expect(component.isSaving).toBeFalse();
  });

  it('retains input and existing payments on failure', () => {
    service.upsertStudentPayment.and.returnValue(throwError(() => new Error('Failed')));
    component.addPayment(form);
    expect(component.amount).toBe(50);
    expect(component.student!.duesPayments.length).toBe(1);
    expect(component.errorMessage).toContain('Unable to save');
    expect(component.isSaving).toBeFalse();
  });

  it('saves an empty list when the last dues payment is deleted', () => {
    const response = new Subject<PaymentList>();
    service.upsertStudentPayment.and.returnValue(response);
    component.ngOnChanges();
    component.pendingDelete = component.paymentData[0];
    component.deletePayment();
    const request = service.upsertStudentPayment.calls.mostRecent().args[0];
    expect(request.paymentListId).toBe('list-1');
    expect(request.payments).toEqual([]);
    expect(component.student!.duesPayments.length).toBe(1);
    response.next(request);
    expect(component.paymentData).toEqual([]);
    expect(component.student!.lastPaidDues).toBeUndefined();
    expect(component.amount).toBe(50);
  });

  it('keeps the payment when deletion fails', () => {
    service.upsertStudentPayment.and.returnValue(throwError(() => new Error('Failed')));
    component.ngOnChanges();
    component.pendingDelete = component.paymentData[0];
    component.deletePayment();
    expect(component.student!.duesPayments.length).toBe(1);
    expect(component.errorMessage).toContain('Unable to delete');
    expect(component.isSaving).toBeFalse();
  });

  it('clears only a test payment while preserving the test record', () => {
    component.student!.testDetails = [{ testRank: -9, testDate: new Date(2026, 9, 1), testFee: 50, payment: { amount: 50, paymentDate: new Date(2026, 9, 1) } }];
    const response = new Subject<Student>();
    studentService.UpsertStudent.and.returnValue(response);
    component.ngOnChanges();
    component.pendingDelete = component.paymentData.find(row => row.test)!;
    component.deletePayment();
    const request = studentService.UpsertStudent.calls.mostRecent().args[0];
    expect(request.testDetails.length).toBe(1);
    expect(request.testDetails[0].payment).toBeUndefined();
    expect(request.testDetails[0].testRank).toBe(-9);
    expect(component.student!.testDetails[0].payment).toBeDefined();
    response.next(request);
    expect(component.student!.testDetails[0].payment).toBeUndefined();
    expect(component.student!.duesPayments.length).toBe(1);
    expect(service.upsertStudentPayment).not.toHaveBeenCalled();
  });

  it('rejects nonpositive amounts', () => {
    component.amount = 0;
    component.addPayment(form);
    expect(service.upsertStudentPayment).not.toHaveBeenCalled();
  });
});
