import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Student } from '../../models/student.model';
import { Rank } from '../../models/rank.model';
import { PaymentType } from '../../models/payment-type.model';
import { TestDetail } from '../../models/test-detail.model';
import { StudentService } from '../../shared/services/student.service';

@Component({
  selector: 'app-student-testing',
  templateUrl: './student-testing.component.html',
  imports: [MatTableModule, DatePipe, CurrencyPipe, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./student-testing.component.css']
})
export class StudentTestingComponent implements OnChanges {
  @Input() student: Student | null = null;
  @Output() studentSaved = new EventEmitter<Student>();
  displayedColumns = ['rank', 'date', 'fee', 'payment', 'testNotes'];
  testData: { rank: string; date: Date; fee: Number; payment: number | null; testNotes?: string }[] = [];
  testRank: Rank = Rank.White;
  testDate: Date | null = null;
  testFee: number | null = null;
  paymentAmount: number | null = null;
  paymentType = PaymentType.Cash;
  testNotes = '';
  isSaving = false;
  errorMessage = '';
  statusMessage = '';
  readonly ranks = Object.values(Rank).filter((value): value is Rank => typeof value === 'number').sort((a, b) => a - b).map(value => ({ value, label: Rank[value] }));
  readonly paymentTypes = Object.values(PaymentType).filter((value): value is PaymentType => typeof value === 'number').map(value => ({ value, label: PaymentType[value] }));

  constructor(private studentService: StudentService) {}

  ngOnChanges(): void {
    this.refreshTests();
  }

  addTest(form: NgForm): void {
    if (form.invalid || this.isSaving || !this.student?.studentId || !this.testDate || Number.isNaN(this.testDate.getTime()) || this.testFee === null || !Number.isFinite(this.testFee) || this.testFee < 0 || (this.paymentAmount !== null && (!Number.isFinite(this.paymentAmount) || this.paymentAmount < 0))) {
      form.control.markAllAsTouched();
      return;
    }
    const student = this.student;
    const test: TestDetail = {
      testRank: this.testRank,
      testDate: this.testDate,
      testFee: this.testFee,
      testNotes: this.testNotes.trim(),
      payment: this.paymentAmount !== null && this.paymentAmount > 0 ? {
        amount: this.paymentAmount,
        paymentDate: this.testDate,
        paymentType: this.paymentType
      } : undefined
    };
    this.isSaving = true;
    this.errorMessage = '';
    this.statusMessage = '';
    this.studentService.UpsertStudent({ ...student, testDetails: [...(student.testDetails ?? []), test] }).subscribe({
      next: saved => {
        Object.assign(student, saved);
        this.isSaving = false;
        this.testDate = null;
        this.testFee = null;
        this.paymentAmount = null;
        this.testNotes = '';
        form.resetForm({ testRank: this.testRank, testDate: null, testFee: null, paymentAmount: null, paymentType: this.paymentType, testNotes: '' });
        this.statusMessage = 'Test saved successfully.';
        this.refreshTests();
        this.studentSaved.emit(saved);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Unable to save test. Please try again.';
      }
    });
  }

  private refreshTests(): void {
    this.testData = [...(this.student?.testDetails ?? [])].sort((a, b) => b.testRank - a.testRank).map(test => ({
      rank: Rank[test.testRank],
      date: new Date(test.testDate),
      fee: test.testFee ?? 0,
      payment: test.payment?.amount ?? null,
      testNotes: test.testNotes
    }));
  }
}
