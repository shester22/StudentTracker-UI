import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StudentService } from '../shared/services/student.service';
import { Student } from '../models/student.model';
import { Rank } from '../models/rank.model';
import {DatePipe} from '@angular/common';
import { RouterLink } from '@angular/router';

interface studentTableData{
  id?: number;
  name?: string;
  rank?: string;
  startDate?: Date;
  lastPaidDues?: Date;
}

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  imports: [MatTableModule, DatePipe, RouterLink],
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  studentList: Student[] = [];
  dataSource: studentTableData[] = [];
  displayedColumns: string[] = ['id','name', 'rank', 'startDate', 'lastPaidDues'];
  
  constructor(private studentService: StudentService) { }

  // todo: add an active flag
  // students who have not been to class for > 90 days will be marked as inactive
  // include last class date?

  ngOnInit() {
    this.studentService.getStudentList().subscribe(data => {
      this.studentList = data;
      if (this.studentList.length > 0) {
        this.studentList.forEach(student => {
          console.log(`Student ID: ${student.id}, Name: ${student.firstName} ${student.lastName}, Rank: ${student.currentRank}, Start Date: ${student.startDate}, Last Paid Dues: ${student.lastPaidDues}`);

          var rankValue = student?.currentRank ?  Rank[student.currentRank] : 'White Belt';

          var tabledata: studentTableData = {
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            rank: rankValue,
            startDate: student.startDate,
            lastPaidDues: student.lastPaidDues
          };
          this.dataSource.push(tabledata);
        });
      }
   
    });
  }

}
