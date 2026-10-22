import { Component, Input, OnChanges } from '@angular/core';
import { Student } from '../../models/student.model';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  imports: [MatTableModule, DatePipe, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnChanges {
  
  displayedColumns: string[] = ['date', 'day', 'type'];
  newAttendanceDate = '';
  newAttendanceType = '';
  constructor() { }

  @Input() student: Student | null = null;
  // need the dates and athe day it was
  attendance: { date: Date, day: string, type: string }[] = [];
  attendanceDates: Date[] = [];

  ngOnChanges() {
    this.refreshAttendance();
  }

  addAttendanceRecord() {
    if (!this.student || !this.newAttendanceDate || !this.newAttendanceType.trim()) {
      return;
    }

    const newDate = new Date(`${this.newAttendanceDate}T00:00:00`);
    if (Number.isNaN(newDate.getTime())) {
      return;
    }

    this.student.classAttendance = [...(this.student.classAttendance ?? []), {
      studentId: this.student.studentId,
      attendanceDate: this.newAttendanceDate,
      attendanceType: this.newAttendanceType.trim()
    }];
    this.newAttendanceDate = '';
    this.newAttendanceType = '';
    this.refreshAttendance();
  }

  // Attendance edits are persisted with the parent student form.
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
        type: detail.attendanceType
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
    this.attendanceDates = this.attendance.map(record => record.date);
  }
}
