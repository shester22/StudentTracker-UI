import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentEditComponent } from './student-edit.component';
import { StudentService } from '../../shared/services/student.service';
import { StudentPaymentService } from '../../shared/services/student-payment.service';
import { StudentAttendanceService } from '../../shared/services/student-attendance.service';
import { Student } from '../../models/student.model';
import { Rank } from '../../models/rank.model';
import { By } from '@angular/platform-browser';

describe('StudentEditComponent', () => {
  let fixture: ComponentFixture<StudentEditComponent>;
  let component: StudentEditComponent;
  let service: jest.Mocked<StudentService>;
  let id: string | null;

  beforeEach(async () => {
    id = null;
    service = ({ getStudentById: jest.fn(), UpsertStudent: jest.fn(), getStudentList: jest.fn() } as unknown as jest.Mocked<StudentService>);
    await TestBed.configureTestingModule({
      imports: [StudentEditComponent, FormsModule],
      providers: [
        provideNoopAnimations(),
        { provide: StudentPaymentService, useValue: ({ upsertStudentPayment: jest.fn(), getPayment: jest.fn(), getPaymentList: jest.fn() } as unknown as jest.Mocked<StudentPaymentService>) },
        { provide: StudentAttendanceService, useValue: ({ upsertStudentAttendance: jest.fn(), upsertStudentAttendanceList: jest.fn(), getStudentAttendanceList: jest.fn() } as unknown as jest.Mocked<StudentAttendanceService>) },
        { provide: StudentService, useValue: service },
        { provide: ActivatedRoute, useValue: { snapshot: { get paramMap() { return convertToParamMap(id ? { id } : {}); } } } }
      ]
    }).compileComponents();
  });

  async function render() {
    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function form(): NgForm {
    return fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
  }

  it('creates a new student without fetching an absent route ID', async () => {
    await render();
    expect(service.getStudentById).not.toHaveBeenCalled();
    expect(Object.keys(form().controls).sort()).toEqual(['firstName', 'lastName', 'dateOfBirth', 'lastPaidDues', 'active'].sort());
    form().setValue({ firstName: 'New', lastName: 'Student', dateOfBirth: '02/03/2010', lastPaidDues: '2026-10-01', active: true });
    service.UpsertStudent.mockImplementation(student => of(student));
    component.onSubmit(form());
    const saved = service.UpsertStudent.mock.lastCall![0];
    expect(saved.firstName).toBe('New');
    expect(saved.dateOfBirth instanceof Date).toBe(true);
    expect(saved.currentRank).toBe(Rank.White);
    expect(component.isEditMode).toBe(true);
  });

  it('loads formatted dates and preserves other student data when updating', async () => {
    id = 'existing-id';
    const student = Object.assign(new Student(), {
      studentId: id, firstName: 'Existing', lastName: 'Student',
      dateOfBirth: '2010-02-03T00:00:00Z', lastPaidDues: '2026-10-01T00:00:00Z',
      currentRank: Rank.Green1, active: false, waiverLink: '/waiver',
      classAttendance: [{ attendanceId: 'attendance-1', studentId: id, attendanceDate: '2026-10-21', attendanceType: 'Class' }]
    });
    service.getStudentById.mockReturnValue(of(student));
    service.UpsertStudent.mockImplementation(value => of(value));
    await render();
    expect(service.getStudentById).toHaveBeenCalledWith(id);
    expect(form().value.dateOfBirth).toBe('02/03/2010');
    expect(form().value.lastPaidDues).toBe('2026-10-01');
    expect(form().value.active).toBe(false);
    const rankInput: HTMLInputElement = fixture.nativeElement.querySelector('input[readonly]');
    expect(rankInput.value).toBe('Green1');
    expect(form().controls['currentRank']).toBeUndefined();
    expect(component.student.classAttendance).toEqual(student.classAttendance);
    form().controls['firstName'].setValue('Updated');
    component.onSubmit(form());
    expect(service.UpsertStudent.mock.lastCall![0].waiverLink).toBe('/waiver');
    expect(service.UpsertStudent.mock.lastCall![0].classAttendance).toEqual(student.classAttendance);
    expect(service.UpsertStudent.mock.lastCall![0].firstName).toBe('Updated');
  });

  it('rejects an invalid form and allows retry after a save error', async () => {
    await render();
    component.onSubmit(form());
    expect(service.UpsertStudent).not.toHaveBeenCalled();
    form().controls['firstName'].setValue('Test');
    form().controls['lastName'].setValue('Student');
    service.UpsertStudent.mockReturnValue(throwError(() => new Error('Failed')));
    component.onSubmit(form());
    expect(component.isSaving).toBe(false);
    expect(component.errorMessage).toContain('Unable to save');
    expect(component.student.firstName).toBe('Test');
  });
});
