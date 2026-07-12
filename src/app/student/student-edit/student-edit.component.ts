import { Component, Input, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import { StudentService } from '../../shared/services/student.service';
import {MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { Rank } from '../../models/rank.model';
import { ActivatedRoute } from '@angular/router';
import { StudentAttendanceComponent } from '../student-attendance/student-attendance.component';
import { StudentTestingComponent } from '../student-testing/student-testing.component';
import { StudentPaymentsComponent } from '../student-payments/student-payments.component';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatInputModule, DatePipe, StudentAttendanceComponent, StudentTestingComponent, StudentPaymentsComponent],
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  @Input() title: string = 'Student Card';
  @Input() content: string = 'This is a card component that can be used to display student information. You can customize the title and content by passing in values to the component.';
  studentId: number = 1; // Example student ID, you can change this to test with different IDs
  student: any;
  subtitle: string ="";
  startDate = new Date(); // Variable holding a Date object

  
  constructor(private studentService: StudentService) { }

  ngOnInit() {
    // Captures the dynamic value from the URL path segment
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.getStudent();
    if (this.student) {
      this.title = `${this.student.firstName} ${this.student.lastName}`;
      this.startDate = new Date(this.student.startDate);
      var rank = this.student.currentRank;

      this.subtitle = 'Current Rank: ' + (this.student ? Rank[this.student.currentRank] : 'N/A');
    }
    console.log('Student:', this.startDate);
  }

  getStudent() {
    this.studentService.getStudentById(this.studentId).subscribe(data => {
      this.student = data;
    });
  }

  // // additional date pipe methods
  // // 3. Helper to format for the view
  // get formattedDate(): string | null {
  //   return this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
  // }

  // // 4. Helper to save back as a Date object
  // onDateChange(newStringValue: string) {
  //   this.startDate = new Date(newStringValue);
  // }

  

}
