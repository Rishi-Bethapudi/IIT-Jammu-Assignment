/**
 * @file Contains validation logic and type definitions for the login form.
 */

// Interface for the login form's data structure.
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  acceptTerms: boolean;
}

// Interface for the structure of validation errors.
export interface ValidationErrors {
  email?: string;
  password?: string;
  acceptTerms?: string;
}

/**
 * Validates a single field of the login form.
 */
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
      // No validation for other fields like 'rememberMe'
      return '';
  }
};
export function validateLoginForm(data: LoginFormData): ValidationErrors {
  return {
    email: validateField('email', data.email),
    password: validateField('password', data.password),
    acceptTerms: validateField('acceptTerms', data.acceptTerms),
  };
}