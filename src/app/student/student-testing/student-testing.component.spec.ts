import { NgForm } from '@angular/forms';
import { Subject, throwError } from 'rxjs';
import { StudentTestingComponent } from './student-testing.component';
import { StudentService } from '../../shared/services/student.service';
import { Student } from '../../models/student.model';
import { Rank } from '../../models/rank.model';

describe('StudentTestingComponent', () => {
  let component: StudentTestingComponent;
  let service: jasmine.SpyObj<StudentService>;
  let form: NgForm;

  beforeEach(() => {
    service = jasmine.createSpyObj('StudentService', ['UpsertStudent']);
    component = new StudentTestingComponent(service);
    component.student = Object.assign(new Student(), {
      studentId: 'student-1', firstName: 'Test', waiverLink: '/waiver',
      testDetails: [{ testRank: Rank.White, testDate: new Date(2026, 0, 1), testFee: 0 }]
    });
    component.testRank = Rank.Yellow;
    component.testDate = new Date(2026, 9, 23);
    component.testFee = 50;
    form = { invalid: false, resetForm: jasmine.createSpy('resetForm'), control: { markAllAsTouched: jasmine.createSpy('markAllAsTouched') } } as unknown as NgForm;
  });

  it('saves the entire student with existing tests and refreshes from the response', () => {
    const response = new Subject<Student>();
    service.UpsertStudent.and.returnValue(response);
    const savedSpy = jasmine.createSpy('studentSaved');
    component.studentSaved.subscribe(savedSpy);
    component.paymentAmount = 50;
    component.addTest(form);
    const request = service.UpsertStudent.calls.mostRecent().args[0];
    expect(request.waiverLink).toBe('/waiver');
    expect(request.testDetails.length).toBe(2);
    expect(request.testDetails[1].testRank).toBe(Rank.Yellow);
    expect(request.testDetails[1].payment?.amount).toBe(50);
    expect(component.student!.testDetails.length).toBe(1);
    component.addTest(form);
    expect(service.UpsertStudent).toHaveBeenCalledTimes(1);
    response.next({ ...request, currentRank: Rank.Yellow });
    expect(component.testData.length).toBe(2);
    expect(component.student!.currentRank).toBe(Rank.Yellow);
    expect(savedSpy).toHaveBeenCalled();
    expect(form.resetForm).toHaveBeenCalled();
    expect(component.isSaving).toBeFalse();
  });

  it('keeps the input and existing records when saving fails', () => {
    service.UpsertStudent.and.returnValue(throwError(() => new Error('Failed')));
    component.addTest(form);
    expect(component.student!.testDetails.length).toBe(1);
    expect(component.testFee).toBe(50);
    expect(component.testDate).toEqual(new Date(2026, 9, 23));
    expect(component.errorMessage).toContain('Unable to save');
    expect(component.isSaving).toBeFalse();
  });

  it('rejects negative fees', () => {
    component.testFee = -1;
    component.addTest(form);
    expect(service.UpsertStudent).not.toHaveBeenCalled();
  });
});
