import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

export function parseBirthDate(value: string): Date | undefined {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return undefined;
  const [month, day, year] = value.split('/').map(Number);
  if (year < 1000) return undefined;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined;
}

@Directive({
  selector: '[appBirthDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => BirthDateDirective), multi: true }]
})
export class BirthDateDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return !control.value || parseBirthDate(control.value) ? null : { birthDate: true };
  }
}
