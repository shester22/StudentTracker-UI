import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import { StudentService } from '../../shared/services/student.service';
import {MatCardModule} from '@angular/material/card';
//import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Rank } from '../../models/rank.model';
import { ActivatedRoute } from '@angular/router';
import { StudentAttendanceComponent } from '../student-attendance/student-attendance.component';
import { StudentTestingComponent } from '../student-testing/student-testing.component';
import { StudentPaymentsComponent } from '../student-payments/student-payments.component';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatInputModule, MatSelectModule, DatePipe, StudentAttendanceComponent, StudentTestingComponent, StudentPaymentsComponent],
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  @Input() title: string = 'Student Card';
  @Input() content: string = 'This is a card component that can be used to display student information. You can customize the title and content by passing in values to the component.';
  studentId: string = "X1234"; // Example student ID, you can change this to test with different IDs
  student: any;
  subtitle: string ="";
  studentRank: string="White Belt";
  startDate = new Date(); // Variable holding a Date object
  datePipe: any;
  studentForm!: FormGroup;
  isEditMode = false;


  
  constructor(private studentService: StudentService, private fb: FormBuilder) { }

  ngOnInit() {
    // Captures the dynamic value from the URL path segment
    this.studentId = String(this.route.snapshot.paramMap.get('id'));
            this.studentForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required], 
            startDate: [''],
            dateOfBirth: ['']
            // email: [this.student?.email || '', [Validators.required, Validators.email]],
            // age: [this.student?.age || '', [Validators.required, Validators.min(1)]]
          });

    this.getStudent();
  }

  getStudent() {
    this.studentService.getStudentById(this.studentId).subscribe(data => {
      this.student = data;
      if (this.student) {
        console.log("student:", this.student);
        this.title = `${this.student.firstName} ${this.student.lastName}`;
        // this.student.startDate = this.formatDateForInput(this.student.startDate);
        // this.student.dateOfBirth = this.formatDateForInput(this.student.dateOfBirth);
        //var rank = this.student.currentRank;
        this.studentRank = this.student.currentRank !== undefined ? Rank[this.student.currentRank] : 'White Belt';
        this.subtitle = 'Current Rank: ' + (this.student ? Rank[this.student.currentRank] : 'N/A');

       
        
        // make this a dropdown with the rank enum values and set the selected value to the current rank of the student
        //let rank = this.student.currentRank !== undefined ? Rank[this.student.currentRank] : 'White Belt';
        // this.studentForm = new FormGroup({
        //   firstName: this.fb.control(this.student?.firstName || '', Validators.required),
        //   lastName: this.fb.control(this.student?.lastName || '', Validators.required),
        // });
        
      }
        let startDate = this.formatDateForInput(this.student.startDate) ? new Date(this.student.startDate) : null;
        let dateOfBirth = this.formatDateForInput(this.student.dateOfBirth) ? new Date(this.student.dateOfBirth) : null;
        this.studentForm = this.fb.group({
            firstName: [this.student?.firstName || '', Validators.required],
            lastName: [this.student?.lastName || '', Validators.required], 
            startDate: [startDate || ''],
            dateOfBirth: [dateOfBirth || '']
            // email: [this.student?.email || '', [Validators.required, Validators.email]],
            // age: [this.student?.age || '', [Validators.required, Validators.min(1)]]
          });
      console.log('Fetched Student:', this.student);
    });
  }

  private formatDateForInput(date: string | Date | undefined): string {
    if (!date) {
      return '';
    }

    return typeof date === 'string' ? date.slice(0, 10) : date.toISOString().slice(0, 10);
  }

  onSubmit(): void {
    console.log("submitted form with values:", this.studentForm.value);
    // if (this.studentForm.valid) {
    //   const studentData: Student = {
    //     ...this.student,
    //     ...this.studentForm.value
    //   };
    //   this.formSubmit.emit(studentData);
    // }
  }

  // // additional date pipe methods
  // // 3. Helper to format for the view
  // get formattedDate(): string | null {
  //   return this.datePipe.transform(this.startDate, 'MM/dd/yyyy');
  // }

  // // 4. Helper to save back as a Date object
  // onDateChange(newStringValue: string) {
  //   this.startDate = new Date(newStringValue);
  // }

  

}
