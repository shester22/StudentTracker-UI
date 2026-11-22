import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentAttendanceService } from './student-attendance.service';
import { environment } from '../../../environments/environment';

describe('StudentAttendanceService', () => {
  it('posts the full attendance list and returns the saved record', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(StudentAttendanceService);
    const http = TestBed.inject(HttpTestingController);
    const record = { id: 'list-1', studentId: 'student-1', count: 1, listItems: [{ attendanceDate: '2026-10-22', attendanceType: 'Class' }] };
    const received = jest.fn();
    service.upsertStudentAttendance(record).subscribe(received);
    const request = http.expectOne(`${environment.apiRootUrl}/Student/Attendance`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(record);
    request.flush(record);
    expect(received).toHaveBeenCalledWith(record);
    http.verify();
  });
});
