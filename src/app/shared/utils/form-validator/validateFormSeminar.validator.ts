import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validatePhoneNumber(
  control: AbstractControl
): ValidationErrors | null {
  const phoneNumberPattern = /^0\d{9}$/;
  return phoneNumberPattern.test(control.value)
    ? null
    : { phoneNumberPattern: true };
}
export function validateEmail(
  control: AbstractControl
): ValidationErrors | null {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(control.value) ? null : { emailPattern: true };
}
