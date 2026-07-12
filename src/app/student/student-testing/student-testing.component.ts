import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Student } from '../../models/student.model';
import { Rank } from '../../models/rank.model';

@Component({
  selector: 'app-student-testing',
  templateUrl: './student-testing.component.html',
  imports: [MatTableModule, DatePipe, CurrencyPipe ],
  styleUrls: ['./student-testing.component.css']
})
export class StudentTestingComponent implements OnInit {
  @Input() student: Student | null = null;
  displayedColumns: string[] = ['rank', 'date', 'fee', 'payment', 'testNotes'];
  testData: { rank: string, date: Date, fee: Number, payment: string, testNotes?: string }[] = [];

  constructor() { }

  ngOnInit() {
    if(this.student) {
      const sortedTests = [...this.student.testDetails].sort((a, b) => b.testRank - a.testRank);

      sortedTests.forEach(test => {
        this.testData.push({
          rank: test.testRank !== undefined ? Rank[test.testRank] : "",
          date: test.testDate,
          fee: test.testFee !== undefined ? test.testFee : 0,
          payment: test.payment !== undefined ? (test.payment.amount !== undefined ? test.payment.amount.toString() : "") : "",
          testNotes: test.testNotes
        });
      });
    }
  }

}
