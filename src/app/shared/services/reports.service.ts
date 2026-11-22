import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceRecord } from '../../models/attendance-record';
import { PaymentList } from '../../models/payment.model';



@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private http = inject(HttpClient);
  private apiRootUrl = `${environment.apiRootUrl}/Reports/`;

  constructor() { }

  getPaymentReport(startDate: string, endDate: string): Observable<PaymentList[]> {
    return this.http.get<PaymentList[]>(`${this.apiRootUrl}studentPayments?startDate=${startDate}&endDate=${endDate}`);
  }
}
