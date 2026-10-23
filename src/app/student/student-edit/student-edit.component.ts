import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student.model';
import { BirthDateDirective, parseBirthDate } from './birth-date.directive';
import { Rank } from '../../models/rank.model';
import { StudentService } from '../../shared/services/student.service';
import { StudentAttendanceComponent } from '../student-attendance/student-attendance.component';
import { StudentTestingComponent } from '../student-testing/student-testing.component';
import { StudentPaymentsComponent } from '../student-payments/student-payments.component';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatCheckboxModule, BirthDateDirective, StudentAttendanceComponent, StudentTestingComponent, StudentPaymentsComponent],
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  @Input() title = 'New Student';
  @Input() content = '';
  student: Student = Object.assign(new Student(), { currentRank: Rank.White, active: true });
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  loadFailed = false;
  errorMessage = '';
  statusMessage = '';

  constructor(private studentService: StudentService) {}

  get currentRankLabel(): string {
    return Rank[this.student.currentRank ?? Rank.White];
  }

  get subtitle(): string {
    return this.student.currentRank === undefined ? '' : `Current Rank: ${Rank[this.student.currentRank]}`;
  }

  dateOfBirth = '';

  onBirthDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    const formatted = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/');
    input.value = formatted;
    this.dateOfBirth = formatted;
    this.student.dateOfBirth = parseBirthDate(formatted);
  }

  get lastPaidDues(): string {
    return this.formatDateForInput(this.student.lastPaidDues);
  }

  set lastPaidDues(value: string) {
    this.student.lastPaidDues = value ? new Date(`${value}T00:00:00`) : undefined;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.getStudent(id);
    }
  }

  getStudent(id: string): void {
    this.isLoading = true;
    this.loadFailed = false;
    this.errorMessage = '';
    this.studentService.getStudentById(id).subscribe({
      next: student => {
        this.setStudent(student);
        this.isLoading = false;
      },
      error: () => {
        this.loadFailed = true;
        this.errorMessage = 'Unable to load the student. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onStudentSaved(student: Student): void {
    this.setStudent(student);
  }

  private setStudent(student: Student): void {
    this.student = Object.assign(new Student(), student, {
      classAttendance: (student.classAttendance ?? []).map(detail => ({ ...detail })),
      duesPayments: (student.duesPayments ?? []).map(payment => ({ ...payment, paymentDate: new Date(payment.paymentDate) })),
      testDetails: student.testDetails ?? [],
      studentNotes: student.studentNotes ?? []
    });
    const birthDate = this.formatDateForInput(student.dateOfBirth);
    this.dateOfBirth = birthDate ? birthDate.slice(5, 7) + '/' + birthDate.slice(8, 10) + '/' + birthDate.slice(0, 4) : '';
    this.title = `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim() || 'Student Card';
  }

  private formatDateForInput(date: string | Date | undefined): string {
    if (!date) return '';
    if (typeof date === 'string') return date.slice(0, 10);
    if (Number.isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isLoading || this.isSaving || this.loadFailed) {
      form.control.markAllAsTouched();
      return;
    }
    this.student.dateOfBirth = parseBirthDate(this.dateOfBirth);
    this.isSaving = true;
    this.errorMessage = '';
    this.statusMessage = '';
    this.studentService.UpsertStudent(this.student).subscribe({
      next: student => {
        this.setStudent(student);
        this.isEditMode = true;
        this.isSaving = false;
        this.statusMessage = 'Student saved successfully.';
        form.form.markAsPristine();
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Unable to save the student. Please try again.';
      }
    });
  }
}
