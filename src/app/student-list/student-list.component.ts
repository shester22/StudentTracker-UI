import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StudentService } from '../shared/services/student.service';
import { Student } from '../models/student.model';
import { Rank } from '../models/rank.model';
import {DatePipe} from '@angular/common';
import { RouterLink } from '@angular/router';

interface studentTableData{
  id?: string;
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
      const rows: studentTableData[] = this.studentList.map(student => {
        var rankValue = student?.currentRank ? Rank[student.currentRank] : 'White Belt';

        return {
          id: student.studentId,
          name: `${student.firstName} ${student.lastName}`,
          rank: rankValue,
          startDate: student.startDate,
          lastPaidDues: student.lastPaidDues ?? new Date()
        };
      });

      // reassign so mat-table's dataSource setter detects the change and re-renders
      this.dataSource = rows;
    });
  }

}
