import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentList, StudentPaymentList } from '../../models/payment.model';
import { MOCK_STUDENTS } from '../mock-data/mock-student-data';
import { environment } from '../../../environments/environment.production';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// Note that the individual student payments will come in the student doc model
// TODO: add methods for adding payment - update the entire payment doc for the student
export class StudentPaymentService {
  private http = inject(HttpClient);
  private apiRootUrl = `${environment.apiRootUrl}/Payment`;

constructor() { }

// will be a list of payments for a single student- updated from the list page
upsertStudentPayment(paymentData: StudentPaymentList[]):Observable<StudentPaymentList[]> {
  // TODO: implement the logic to add or update the payment for the student
  return new Observable<StudentPaymentList[]>(observer => {
    observer.next(paymentData);
    observer.complete();
  });
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
