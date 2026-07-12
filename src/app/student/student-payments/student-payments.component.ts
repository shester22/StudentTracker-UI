import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../models/student.model';
import { MonthEnum } from '../../models/month-enum.enum';
import { PaymentType } from '../../models/payment-type.model';
import { Rank } from '../../models/rank.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-student-payments',
  templateUrl: './student-payments.component.html',
   imports: [MatTableModule, DatePipe, CurrencyPipe ],
  styleUrls: ['./student-payments.component.css']
})
export class StudentPaymentsComponent implements OnInit {
  @Input() student: Student | null = null;
  displayedColumns: string[] = ['date', 'amount', 'paymentFor', 'paymentMethod', 'paymentNotes'];
  paymentData: { date: Date, amount: number, paymentFor: string, paymentMethod: string, paymentNotes?: string }[] = [];
  constructor() { }

  ngOnInit() {
    if (this.student) {
      this.student.duesPayments.forEach(payment => {
        this.paymentData.push({
          date: payment.paymentDate,
          amount: payment.amount,
          paymentFor: "Monthly Dues: " + (payment.forMonth !== undefined && payment.forYear !== undefined ? `${MonthEnum[payment.forMonth]}/${payment.forYear}` : ""),
          paymentMethod: (payment.paymentType !== undefined ? PaymentType[payment.paymentType]   : ""),
          paymentNotes: payment.paymentNotes
        });
      });

      if(this.student.testDetails)
        this.student.testDetails.forEach(test => {
         if (test?.payment) {
            this.paymentData.push({
              date: test?.payment?.paymentDate,
              amount: test.payment.amount,
              paymentFor: "Test: " + (test.testRank !== undefined && test.testDate !== undefined ? `${Rank[test.testRank]} Belt - ${new Date(test.testDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}` : ""),
              paymentMethod: (test.payment.paymentType !== undefined ? PaymentType[test.payment.paymentType]   : ""),
              paymentNotes: test.payment.paymentNotes
            });
          }
        });

      this.paymentData.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    


  }

}
