import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Payment } from '../../models/payment.model';
import { MonthEnum } from '../../models/month-enum.enum';
import { PaymentType } from '../../models/payment-type.model';
import { ReportsService } from '../../shared/services/reports.service';

interface PaymentReportRow extends Payment {
  studentId: string;
  studentName: string;
  paymentMethod: string;
  paymentFor: string;
}

@Component({
  selector: 'app-student-payment-report',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, CurrencyPipe, DatePipe],
  templateUrl: './student-payment-report.component.html',
  styleUrl: './student-payment-report.component.scss'
})
export class StudentPaymentReportComponent {
  private reportsService = inject(ReportsService);
  startDate = '';
  endDate = '';
  displayedColumns = ['studentName', 'paymentMethod', 'paymentDate', 'paymentFor', 'amount'];
  payments = new MatTableDataSource<PaymentReportRow>();
  isLoading = false;
  errorMessage = '';

  get totalAmount(): number {
    return this.payments.data.reduce((total, payment) => total + payment.amount, 0);
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.payments.sort = sort;
  }

  constructor() {
    this.payments.sortingDataAccessor = (payment, column) => {
      switch (column) {
        case 'paymentFor':
          return (payment.forYear ?? 0) * 12 + (payment.forMonth ?? 0);
        case 'paymentDate':
          return new Date(payment.paymentDate).getTime() || 0;
        case 'amount':
          return payment.amount;
        case 'studentName':
          return payment.studentName.toLocaleLowerCase();
        default:
          return payment.paymentMethod.toLocaleLowerCase();
      }
    };
  }

  printReport(): void {
    window.print();
  }

  setYearToDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.startDate = `${year}-01-01`;
    this.endDate = `${year}-${month}-${day}`;
  }

  submit(form: NgForm): void {
    if (form.invalid || this.isLoading || this.startDate > this.endDate) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.reportsService.getPaymentReport(this.startDate, this.endDate).subscribe({
      next: payments => {
        this.payments.data = payments.flatMap(student => (student.payments ?? []).map(payment => ({
          ...payment,
          studentId: student.studentId,
          studentName: student.studentName ?? student.studentId,
          paymentMethod: payment.paymentType !== undefined ? PaymentType[payment.paymentType] ?? '' : '',
          paymentFor: [payment.forMonth !== undefined ? MonthEnum[payment.forMonth] : '', payment.forYear]
            .filter(value => value !== undefined && value !== '').join(' ')
        })));
        this.isLoading = false;

        console.log('Payment report loaded', payments);
      },
      error: (error) => {
        console.error('Error loading payment report', error);
        this.isLoading = false;
        this.errorMessage = 'Unable to load the payment report. Please try again.';
      }
    });
  }
}
