import { Routes } from '@angular/router';
import { StudentEditComponent } from './student/student-edit/student-edit.component';
import { StudentListComponent } from './student-list/student-list.component';


export const routes: Routes = [
  { path: 'user-edit', component: StudentEditComponent },
  { path: 'student-edit', component: StudentEditComponent },
  { path: 'student-edit/:id', component: StudentEditComponent },
  { path: 'student-list', component: StudentListComponent },
  { path: '', redirectTo: '/student-list', pathMatch: 'full'},
];
