import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Payment, PaymentList, StudentPaymentList } from '../../models/payment.model';
import { MOCK_STUDENTS } from '../mock-data/mock-student-data';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// Note that the individual student payments will come in the student doc model
// TODO: add methods for adding payment - update the entire payment doc for the student
export class StudentPaymentService {
  private http = inject(HttpClient);
  private apiRootUrl = `${environment.apiRootUrl}/Student/Payments`;

constructor() { }

// will be a list of payments for a single student- updated from the list page
upsertStudentPayment(paymentData: PaymentList): Observable<PaymentList> {
  return this.http.post<{ id: string; studentId: string; count: number; listItems: Payment[] }>(
    `${this.apiRootUrl}/upsert`, {
      id: paymentData.paymentListId || undefined,
      studentId: paymentData.studentId,
      count: paymentData.payments.length,
      listItems: paymentData.payments
    }
  ).pipe(map(saved => ({
    paymentListId: saved.id,
    studentId: saved.studentId,
    count: saved.count,
    payments: saved.listItems
  })));
}

// single payment for a student
getPayment(studentId: string, paymentListId: string):Observable<PaymentList> {
  var paymentList: PaymentList = {
    studentId: studentId,
    paymentListId: paymentListId,
    count: 0,
    payments: []
  };
  return new Observable<PaymentList>(observer => {
    observer.next(paymentList);
    observer.complete();
  });

}

// list of payments that include the payment Doc id and the student Id
// all student payments in a given time frame
// should this be due date and not when paid? ie July dues payment should show even if they paid at the end of June
getPaymentList(startDate: Date, endDate: Date):Observable<StudentPaymentList[]> {
  // TODO: implement the logic to fetch all student payments within the given time frame
  // this model will need to look different -- the payments will need studentId, payment(docId) and then payment info
  var paymentLists: StudentPaymentList[] = [];
  return new Observable<StudentPaymentList[]>(observer => {
    observer.next(paymentLists);
    observer.complete();
  });
}


}
