import { Component, Input, OnChanges } from '@angular/core';
import { Student } from '../../models/student.model';
import { Payment } from '../../models/payment.model';
import { TestDetail } from '../../models/test-detail.model';
import { StudentService } from '../../shared/services/student.service';
import { MonthEnum } from '../../models/month-enum.enum';
import { PaymentType } from '../../models/payment-type.model';
import { Rank } from '../../models/rank.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { StudentPaymentService } from '../../shared/services/student-payment.service';

@Component({
  selector: 'app-student-payments',
  templateUrl: './student-payments.component.html',
  imports: [MatTableModule, DatePipe, CurrencyPipe, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./student-payments.component.css']
})
export class StudentPaymentsComponent implements OnChanges {
  @Input() student: Student | null = null;
  displayedColumns: string[] = ['date', 'amount', 'paymentFor', 'paymentMethod', 'paymentNotes', 'actions'];
  paymentData: { date: Date, amount: number, paymentFor: string, paymentMethod: string, paymentNotes?: string, payment: Payment, test?: TestDetail }[] = [];
  pendingDelete: { payment: Payment; test?: TestDetail } | null = null;
  paymentDate: Date | null = null;
  amount: number | null = null;
  forMonth = new Date().getMonth() + 1;
  forYear = new Date().getFullYear();
  paymentType: PaymentType = PaymentType.Cash;
  paymentNote = '';
  isSaving = false;
  errorMessage = '';
  statusMessage = '';
  readonly months = Object.values(MonthEnum).filter((value): value is MonthEnum => typeof value === 'number').map(value => ({ value, label: MonthEnum[value] }));
  readonly paymentTypes = Object.values(PaymentType).filter((value): value is PaymentType => typeof value === 'number').map(value => ({ value, label: PaymentType[value] }));

  constructor(private paymentService: StudentPaymentService, private studentService: StudentService) {}

  addPayment(form: NgForm): void {
    if (form.invalid || this.isSaving || !this.student?.studentId || !this.paymentDate || Number.isNaN(this.paymentDate.getTime()) || this.amount === null || !Number.isFinite(this.amount) || this.amount <= 0 || !Number.isInteger(this.forYear)) {
      form.control.markAllAsTouched();
      return;
    }
    const student = this.student;
    const payments = [...(student.duesPayments ?? []), {
      paymentDate: this.paymentDate,
      amount: this.amount,
      forMonth: this.forMonth,
      forYear: this.forYear,
      paymentType: this.paymentType,
      paymentNote: this.paymentNote.trim()
    }];
    this.isSaving = true;
    this.errorMessage = '';
    this.statusMessage = '';
    this.paymentService.upsertStudentPayment({
      studentId: student.studentId!, paymentListId: student.paymentListId ?? '', count: payments.length, payments
    }).subscribe({
      next: saved => {
        student.paymentListId = saved.paymentListId;
        student.duesPayments = saved.payments.map(payment => ({ ...payment, paymentDate: new Date(payment.paymentDate) }));
        student.lastPaidDues = student.duesPayments.reduce<Date | undefined>((latest, payment) => !latest || payment.paymentDate > latest ? payment.paymentDate : latest, undefined);
        this.isSaving = false;
        this.paymentDate = null;
        this.amount = null;
        this.paymentNote = '';
        form.resetForm({ paymentDate: null, amount: null, forMonth: this.forMonth, forYear: this.forYear, paymentType: this.paymentType, paymentNote: '' });
        this.statusMessage = 'Payment saved successfully.';
        this.refreshPayments();
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Unable to save payment. Please try again.';
      }
    });
  }

  deletePayment(): void {
    const student = this.student;
    const row = this.pendingDelete;
    this.pendingDelete = null;
    if (this.isSaving || !student?.studentId || !row) return;
    if (row.test ? !student.testDetails.includes(row.test) || row.test.payment !== row.payment : !student.duesPayments.includes(row.payment)) return;
    this.isSaving = true;
    this.errorMessage = '';
    this.statusMessage = '';
    const onError = () => {
      this.isSaving = false;
      this.errorMessage = 'Unable to delete payment. Please try again.';
    };
    const onSuccess = () => {
      this.isSaving = false;
      this.statusMessage = 'Payment deleted successfully.';
      this.refreshPayments();
    };
    if (row.test) {
      const testDetails = student.testDetails.map(test => test === row.test ? { ...test, payment: undefined } : test);
      this.studentService.UpsertStudent({ ...student, testDetails }).subscribe({
        next: saved => {
          student.testDetails = saved.testDetails;
          onSuccess();
        },
        error: onError
      });
    } else {
      const payments = student.duesPayments.filter(payment => payment !== row.payment);
      this.paymentService.upsertStudentPayment({
        studentId: student.studentId, paymentListId: student.paymentListId ?? '', count: payments.length, payments
      }).subscribe({
        next: saved => {
          student.paymentListId = saved.paymentListId;
          student.duesPayments = saved.payments.map(payment => ({ ...payment, paymentDate: new Date(payment.paymentDate) }));
          student.lastPaidDues = student.duesPayments.reduce<Date | undefined>((latest, payment) => !latest || payment.paymentDate > latest ? payment.paymentDate : latest, undefined);
          onSuccess();
        },
        error: onError
      });
    }
  }

  ngOnChanges() {
    this.refreshPayments();
  }

  private refreshPayments() {
    this.paymentData = [];
    if (this.student) {
      this.student.duesPayments.forEach(payment => {
        this.paymentData.push({
          date: new Date(payment.paymentDate),
          amount: payment.amount,
          paymentFor: "Monthly Dues: " + (payment.forMonth !== undefined && payment.forYear !== undefined ? `${MonthEnum[payment.forMonth]}/${payment.forYear}` : ""),
          paymentMethod: (payment.paymentType !== undefined ? PaymentType[payment.paymentType]   : ""),
          paymentNotes: payment.paymentNote,
          payment
        });
      });

      if(this.student.testDetails)
        this.student.testDetails.forEach(test => {
         if (test?.payment) {
            this.paymentData.push({
              date: new Date(test.payment.paymentDate),
              amount: test.payment.amount,
              paymentFor: "Test: " + (test.testRank !== undefined && test.testDate !== undefined ? `${Rank[test.testRank]} Belt - ${new Date(test.testDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}` : ""),
              paymentMethod: (test.payment.paymentType !== undefined ? PaymentType[test.payment.paymentType]   : ""),
              paymentNotes: test.payment.paymentNote,
              payment: test.payment,
              test
            });
          }
        });

      this.paymentData.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    


  }

}
