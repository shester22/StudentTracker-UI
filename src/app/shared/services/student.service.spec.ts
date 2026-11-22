import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../../models/student.model';
import { environment } from '../../../environments/environment';

describe('StudentService', () => {
  let service: StudentService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(StudentService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('loads a student from the API', () => {
    const student = Object.assign(new Student(), { studentId: 'student-1' });
    const received = jest.fn();
    service.getStudentById('student-1').subscribe(received);
    const request = http.expectOne(`${environment.apiRootUrl}/Student/student-1`);
    expect(request.request.method).toBe('GET');
    request.flush(student);
    expect(received).toHaveBeenCalledWith(student);
  });

  it('posts the full student to upsert', () => {
    const student = Object.assign(new Student(), { studentId: 'student-1' });
    service.UpsertStudent(student).subscribe();
    const request = http.expectOne(`${environment.apiRootUrl}/Student/upsert`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(student);
    request.flush(student);
  });
});
