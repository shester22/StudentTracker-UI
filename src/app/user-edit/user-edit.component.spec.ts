import { TestBed } from '@angular/core/testing';
import { UserEditComponent } from './user-edit.component';

describe('UserEditComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [UserEditComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UserEditComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
