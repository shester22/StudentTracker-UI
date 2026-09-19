import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentAttendanceService {
  private http = inject(HttpClient);
  private apiRootUrl = `${environment.apiRootUrl}/Attendance`;

constructor() { }

upsertStudentAttendance(attendanceData: any): Observable<any> {
  // TODO: implement the logic to add or update the attendance for the student
  return new Observable<any>(observer => {
    observer.next(attendanceData);
    observer.complete();
  });
}

upsertStudentAttendanceList(attendanceListData: any[]): Observable<any[]> {
  // TODO: implement the logic to add or update the attendance list for multiple students
  return new Observable<any[]>(observer => {
    observer.next(attendanceListData);
    observer.complete();
  });
}

getStudentAttendanceList(studentId: string, beginDate: Date, endDate: Date): Observable<any> {
  // TODO: implement the logic to fetch the attendance for a list of students
  var attendanceData: any = {
    studentId: studentId,
    attendanceRecords: []
  };
  return new Observable<any>(observer => {
    observer.next(attendanceData);
    observer.complete();
  });
}

}
