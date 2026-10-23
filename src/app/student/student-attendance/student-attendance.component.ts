import { Component, Input, OnChanges } from '@angular/core';
import { Student } from '../../models/student.model';
import { AttendanceDetail } from '../../models/attendance-detail';
import { StudentAttendanceService } from '../../shared/services/student-attendance.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  imports: [MatTableModule, DatePipe, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnChanges {
  
  displayedColumns: string[] = ['date', 'day', 'type', 'actions'];
  attendanceDate: Date | null = null;
  pendingDelete: AttendanceDetail | null = null;
  newAttendanceType = 'Class';
  isSaving = false;
  errorMessage = '';
  constructor(private attendanceService: StudentAttendanceService) { }

  @Input() student: Student | null = null;
  // need the dates and athe day it was
  attendance: { date: Date, day: string, type: string, detail: AttendanceDetail }[] = [];
  attendanceDates: Date[] = [];

  get newAttendanceDate(): string {
    const date = this.attendanceDate;
    if (!date || Number.isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  set newAttendanceDate(value: string) {
    this.attendanceDate = value ? new Date(`${value}T00:00:00`) : null;
  }
  ngOnChanges() {
    this.refreshAttendance();
  }

  addAttendanceRecord() {
    if (this.isSaving || !this.student?.studentId || !this.newAttendanceDate || !this.newAttendanceType.trim()) {
      return;
    }

    const newDate = new Date(`${this.newAttendanceDate}T00:00:00`);
    if (Number.isNaN(newDate.getTime())) {
      return;
    }

    const student = this.student;
    const listItems = [...(student.classAttendance ?? []), {
      studentId: student.studentId,
      attendanceDate: this.newAttendanceDate,
      attendanceType: this.newAttendanceType.trim()
    }];
    this.isSaving = true;
    this.errorMessage = '';
    this.attendanceService.upsertStudentAttendance({
      id: student.attendanceListId,
      studentId: student.studentId!,
      count: listItems.length,
      listItems
    }).subscribe({
      next: saved => {
        student.attendanceListId = saved.id;
        student.classAttendance = saved.listItems;
        this.isSaving = false;
        this.newAttendanceDate = '';
        this.newAttendanceType = 'Class';
        this.refreshAttendance();
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Unable to save attendance. Please try again.';
      }
    });
  }
  deleteAttendanceRecord(): void {
    const student = this.student;
    const record = this.pendingDelete;
    this.pendingDelete = null;
    if (this.isSaving || !student?.studentId || !record || !student.classAttendance.includes(record)) return;

    // Use the source object so sorting and duplicate dates cannot delete another row.
    const listItems = student.classAttendance.filter(detail => detail !== record);
    this.isSaving = true;
    this.errorMessage = '';
    this.attendanceService.upsertStudentAttendance({
      id: student.attendanceListId,
      studentId: student.studentId,
      count: listItems.length,
      listItems
    }).subscribe({
      next: saved => {
        student.attendanceListId = saved.id;
        student.classAttendance = saved.listItems;
        this.isSaving = false;
        this.refreshAttendance();
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Unable to delete attendance. Please try again.';
      }
    });
  }

  private refreshAttendance() {
    if (!this.student) {
      this.attendanceDates = [];
      this.attendance = [];
      return;
    }

    this.attendance = (this.student.classAttendance ?? []).map(detail => {
      // Date-only API values represent local calendar days, not UTC instants.
      const date = new Date(detail.attendanceDate.length === 10
        ? `${detail.attendanceDate}T00:00:00`
        : detail.attendanceDate);
      return {
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        type: detail.attendanceType,
        detail
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
    this.attendanceDates = this.attendance.map(record => record.date);
  }
}
