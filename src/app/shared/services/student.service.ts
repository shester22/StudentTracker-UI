import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../../models/student.model'
import { MOCK_STUDENTS } from '../mock-data/mock-student-data';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

constructor() { }

// get student by id
getStudentById(id: number):Observable<Student> {
  // logic to get student by id  
  const student = MOCK_STUDENTS.find(s => s.id === id);
  return new Observable<Student>(observer => {
    if (student) {
      observer.next(student);
    } else {
      observer.error(new Error('Student not found'));
    }
    observer.complete();
  });
  }

  getStudentList(): Observable<Student[]> {
    // logic to get student list
    const student = MOCK_STUDENTS;
    return of(student);

  }
}
