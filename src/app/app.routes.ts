import { Routes } from '@angular/router';
import { StudentPaymentReportComponent } from './reports/student-payment-report/student-payment-report.component';
import { StudentEditComponent } from './student/student-edit/student-edit.component';
import { StudentListComponent } from './student-list/student-list.component';


export const routes: Routes = [
  { path: 'student-payment-report', component: StudentPaymentReportComponent },
  { path: 'user-edit', component: StudentEditComponent },
  { path: 'student-edit', component: StudentEditComponent },
  { path: 'student-edit/:id', component: StudentEditComponent },
  { path: 'student-list', component: StudentListComponent },
  { path: '', redirectTo: '/student-list', pathMatch: 'full'},
];
