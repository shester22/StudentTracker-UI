import { Subject, throwError } from 'rxjs';
import { StudentAttendanceComponent } from './student-attendance.component';
import { StudentAttendanceService } from '../../shared/services/student-attendance.service';
import { Student } from '../../models/student.model';
import { AttendanceRecord } from '../../models/attendance-record';

describe('StudentAttendanceComponent', () => {
  let component: StudentAttendanceComponent;
  let service: jest.Mocked<StudentAttendanceService>;

  beforeEach(() => {
    service = ({ upsertStudentAttendance: jest.fn(), upsertStudentAttendanceList: jest.fn(), getStudentAttendanceList: jest.fn() } as unknown as jest.Mocked<StudentAttendanceService>);
    component = new StudentAttendanceComponent(service);
    component.student = Object.assign(new Student(), {
      studentId: 'student-1', attendanceListId: 'list-1',
      classAttendance: [{ attendanceId: 'old-1', attendanceDate: '2026-10-20', attendanceType: 'Class' }]
    });
    component.newAttendanceDate = '2026-10-22';
    component.newAttendanceType = 'Class';
  });

  it('saves the existing list plus the new record and waits for success', () => {
    const response = new Subject<AttendanceRecord>();
    service.upsertStudentAttendance.mockReturnValue(response);
    component.addAttendanceRecord();
    const request = service.upsertStudentAttendance.mock.lastCall![0];
    expect(request.id).toBe('list-1');
    expect(request.studentId).toBe('student-1');
    expect(request.count).toBe(2);
    expect(request.listItems[0].attendanceId).toBe('old-1');
    expect(component.student!.classAttendance.length).toBe(1);
    component.addAttendanceRecord();
    expect(service.upsertStudentAttendance).toHaveBeenCalledTimes(1);
    response.next({ ...request, listItems: [request.listItems[0], { ...request.listItems[1], attendanceId: 'new-1' }] });
    expect(component.student!.classAttendance[1].attendanceId).toBe('new-1');
    expect(component.attendance.length).toBe(2);
    expect(component.newAttendanceDate).toBe('');
    expect(component.isSaving).toBe(false);
  });

  it('keeps the inputs and existing records when saving fails', () => {
    service.upsertStudentAttendance.mockReturnValue(throwError(() => new Error('Failed')));
    component.addAttendanceRecord();
    expect(component.student!.classAttendance.length).toBe(1);
    expect(component.newAttendanceDate).toBe('2026-10-22');
    expect(component.newAttendanceType).toBe('Class');
    expect(component.errorMessage).toContain('Unable to save');
    expect(component.isSaving).toBe(false);
  });

  it('keeps the selected date stable and formats its local calendar day for saving', () => {
    const selected = new Date(2026, 9, 22);
    component.attendanceDate = selected;
    expect(component.attendanceDate).toBe(selected);
    expect(component.attendanceDate).toBe(component.attendanceDate);
    expect(component.newAttendanceDate).toBe('2026-10-22');
    component.newAttendanceDate = '';
    expect(component.attendanceDate).toBeNull();
  });

  it('deletes only the confirmed source row and saves before updating the table', () => {
    const duplicate = { attendanceId: 'other', attendanceDate: '2026-10-20', attendanceType: 'Class' };
    component.student!.classAttendance.push(duplicate);
    component.ngOnChanges();
    component.pendingDelete = component.attendance[0].detail;
    const response = new Subject<AttendanceRecord>();
    service.upsertStudentAttendance.mockReturnValue(response);
    component.deleteAttendanceRecord();
    const request = service.upsertStudentAttendance.mock.lastCall![0];
    expect(request.id).toBe('list-1');
    expect(request.studentId).toBe('student-1');
    expect(request.count).toBe(1);
    expect(request.listItems).toEqual([duplicate]);
    expect(component.student!.classAttendance.length).toBe(2);
    response.next(request);
    expect(component.student!.classAttendance).toEqual([duplicate]);
    expect(component.attendance.length).toBe(1);
    expect(component.newAttendanceDate).toBe('2026-10-22');
    expect(component.isSaving).toBe(false);
  });

  it('keeps a row when deletion fails and allows an empty list when deleting the last row', () => {
    component.pendingDelete = component.student!.classAttendance[0];
    service.upsertStudentAttendance.mockReturnValue(throwError(() => new Error('Failed')));
    component.deleteAttendanceRecord();
    expect(service.upsertStudentAttendance.mock.lastCall![0].listItems).toEqual([]);
    expect(component.student!.classAttendance.length).toBe(1);
    expect(component.errorMessage).toContain('Unable to delete');
    expect(component.isSaving).toBe(false);
  });

  it('does not save a deletion without a confirmed row', () => {
    component.pendingDelete = null;
    component.deleteAttendanceRecord();
    expect(service.upsertStudentAttendance).not.toHaveBeenCalled();
  });

  it('paginates sorted attendance with eight records per page', () => {
    component.student!.classAttendance = Array.from({ length: 17 }, (_, index) => ({
      attendanceId: String(index), attendanceDate: `2026-10-${String(index + 1).padStart(2, '0')}`, attendanceType: 'Class'
    }));
    component.ngOnChanges();
    expect(component.attendancePage.length).toBe(8);
    expect(component.attendancePage[0].detail.attendanceId).toBe('16');
    component.pageIndex = 1;
    expect(component.attendancePage.length).toBe(8);
    component.pageIndex = 2;
    expect(component.attendancePage.length).toBe(1);
  });

  it('moves to the previous page after deleting the last row on the final page', () => {
    component.student!.classAttendance = Array.from({ length: 9 }, (_, index) => ({
      attendanceId: String(index), attendanceDate: `2026-10-${String(index + 1).padStart(2, '0')}`, attendanceType: 'Class'
    }));
    component.ngOnChanges();
    component.pageIndex = 1;
    component.pendingDelete = component.attendancePage[0].detail;
    const response = new Subject<AttendanceRecord>();
    service.upsertStudentAttendance.mockReturnValue(response);
    component.deleteAttendanceRecord();
    response.next(service.upsertStudentAttendance.mock.lastCall![0]);
    expect(component.pageIndex).toBe(0);
    expect(component.attendancePage.length).toBe(8);
  });

  it('requires a saved student before saving attendance', () => {
    component.student!.studentId = undefined;
    component.addAttendanceRecord();
    expect(service.upsertStudentAttendance).not.toHaveBeenCalled();
  });
});
