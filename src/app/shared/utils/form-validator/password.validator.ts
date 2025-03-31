import { AbstractControl, ValidationErrors } from '@angular/forms';
import { passwordRegex } from '../../data-access/const/password-regex.const';

export function validatePassword(
  passwordControl: AbstractControl
): ValidationErrors | null {
  const value = passwordControl.value;
  const password = new RegExp(passwordRegex);
  if (value && !password.test(value)) {
    return {
      passwordPattern: true,
    };
  }
  return null;
}
