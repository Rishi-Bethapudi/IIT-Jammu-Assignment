import type { RegisterFormData, ValidationErrors } from './types';

export const validateField = (
  field: keyof RegisterFormData,
  value: string | boolean,
  formData?: RegisterFormData
): string => {
  switch (field) {
    case 'firstName':
      if (!value || (value as string).trim().length < 2) {
        return 'First name must be at least 2 characters long';
      }
      return '';
    case 'lastName':
      if (!value || (value as string).trim().length < 2) {
        return 'Last name must be at least 2 characters long';
      }
      return '';
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value as string)) {
        return 'Please enter a valid email address';
      }
      return '';
    case 'phone':
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
      if (!value || !phoneRegex.test(value as string)) {
        return 'Please enter a valid phone number';
      }
      return '';
    case 'password':
      const password = value as string;
      if (!password || password.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return 'Password must contain at least one uppercase letter, lowercase letter, and number';
      }
      return '';
    case 'confirmPassword':
      if (!formData || value !== formData.password) {
        return 'Passwords do not match';
      }
      return '';
    case 'dateOfBirth':
      if (!value) {
        return 'Date of birth is required';
      }
      const birthDate = new Date(value as string);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        return 'You must be at least 13 years old to register';
      }
      return '';
    case 'address':
      if (!value || (value as string).trim().length < 10) {
        return 'Please enter a complete address (minimum 10 characters)';
      }
      return '';
    case 'city':
      if (!value || (value as string).trim().length < 2) {
        return 'Please enter a valid city name';
      }
      return '';
    case 'pincode':
      const pincodeRegex = /^\d{6}$/;
      if (!value || !pincodeRegex.test(value as string)) {
        return 'Please enter a valid 6-digit pincode';
      }
      return '';
    case 'agreesToTerms':
      if (!value) {
        return 'You must agree to the terms and conditions to register';
      }
      return '';
    default:
      return '';
  }
};

export const validateStep = (
  step: number, 
  formData: RegisterFormData
): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  if (step === 1) {
    // Personal Information
    ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'].forEach(
      (field) => {
        const error = validateField(
          field as keyof RegisterFormData,
          formData[field as keyof RegisterFormData],
          formData
        );
        if (error) newErrors[field as keyof ValidationErrors] = error;
      }
    );
  } else if (step === 2) {
    // Password and Address
    ['password', 'confirmPassword', 'address', 'city', 'pincode'].forEach(
      (field) => {
        const error = validateField(
          field as keyof RegisterFormData,
          formData[field as keyof RegisterFormData],
          formData
        );
        if (error) newErrors[field as keyof ValidationErrors] = error;
      }
    );
  } else if (step === 3) {
    // Terms agreement
    const termsError = validateField('agreesToTerms', formData.agreesToTerms, formData);
    if (termsError) newErrors.agreesToTerms = termsError;
  }

  return newErrors;
};