import { Component, Input, OnInit } from '@angular/core';
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
export class StudentAttendanceComponent implements OnInit {
  
  displayedColumns: string[] = ['date','day'];
  newAttendanceDate = '';
  constructor() { }

  @Input() student: Student | null = null;
  // need the dates and athe day it was
  attendance: { date: Date, day: string }[] = [];
  attendanceDates: Date[] = [];

  ngOnInit() {
    this.refreshAttendance();
  }

  addAttendanceRecord() {
    if (!this.student || !this.newAttendanceDate) {
      return;
    }

    const newDate = new Date(`${this.newAttendanceDate}T00:00:00`);
    if (Number.isNaN(newDate.getTime())) {
      return;
    }

    this.student.classAttendance = [...this.student.classAttendance, newDate];
    this.newAttendanceDate = '';
    this.refreshAttendance();
  }

  // TODO: need to ad actual save functionality
  // can do this with a unique endpoint where you send the attendance date and user id or just update and send the whole user
  // in the future, records will likely be updated by an attendance taking component/module 
  private refreshAttendance() {
    if (!this.student) {
      this.attendanceDates = [];
      this.attendance = [];
      return;
    }

    this.attendanceDates = [...this.student.classAttendance].sort((a, b) => b.getTime() - a.getTime());
    this.attendance = this.attendanceDates.map(date => ({
      date,
      day: date.toLocaleDateString('en-US', { weekday: 'long' })
    }));
  }

}
