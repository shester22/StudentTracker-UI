import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../shared/services/student.service';
import { Student } from '../models/student.model';

describe('StudentListComponent', () => {
  it('loads and displays students', async () => {
    const student = Object.assign(new Student(), { studentId: 'student-1', firstName: 'Jane', lastName: 'Doe' });
    const getStudentList = jest.fn().mockReturnValue(of([student]));
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [provideRouter([]), { provide: StudentService, useValue: { getStudentList } }]
    }).compileComponents();
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    expect(getStudentList).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('Jane Doe');
  });
});
