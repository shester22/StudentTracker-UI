import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Student } from '../../models/student.model';
import { MOCK_STUDENTS } from '../mock-data/mock-student-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);
  private apiRootUrl = `${environment.apiRootUrl}/Student`;

constructor() { }

// get student by id
getStudentById(id: string):Observable<Student> {
  // logic to get student by id  
  //const student = MOCK_STUDENTS.find(s => s.studentId === id);
  const studentUrl = `${this.apiRootUrl}/${id}`;


  return new Observable<Student>(observer => {
    this.http.get<Student>(studentUrl).subscribe({
      next: (student) => observer.next(student),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
}

  getStudentList(): Observable<Student[]> {
    const listUrl = `${this.apiRootUrl}/studentlist`;
    return this.http.get<Student[]>(listUrl);
    // logic to get mock student list
    // const student = MOCK_STUDENTS;
    // return of(student);

  }
}
