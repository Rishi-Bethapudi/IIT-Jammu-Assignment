import type { LoginFormData, ValidationErrors } from './types';

export const validateField = (
  field: keyof LoginFormData,
  value: string | boolean
): string => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value as string)) {
        return 'Please enter a valid email address';
      }
      return '';
    case 'password':
      if (!value || (value as string).length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return '';
    case 'acceptTerms':
      if (!value) {
        return 'You must accept the terms to continue';
      }
      return '';
    default:
      return '';
  }
};

export const validateLoginForm = (formData: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateField('email', formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateField('password', formData.password);
  if (passwordError) errors.password = passwordError;

  const acceptTermsError = validateField('acceptTerms', formData.acceptTerms);
  if (acceptTermsError) errors.acceptTerms = acceptTermsError;

  return errors;
};