// utils/validation.ts
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  pincode: string;
  agreesToTerms: boolean;
  agreesToMarketing: boolean;
}

export type ValidationErrors = {
  [K in keyof RegisterFormData]?: string;
};

// --- Single field validator ---
export const validateField = (
  field: keyof RegisterFormData,
  formData: RegisterFormData
): string | undefined => {
  switch (field) {
    case 'firstName':
      return formData.firstName.trim()
        ? undefined
        : 'First Name is required';
    case 'lastName':
      return formData.lastName.trim()
        ? undefined
        : 'Last Name is required';
    case 'email':
      return formData.email
        ? /\S+@\S+\.\S+/.test(formData.email)
          ? undefined
          : 'Enter a valid email'
        : 'Email is required';
    case 'phone':
      return formData.phone.trim()
        ? undefined
        : 'Phone number is required';
    case 'password':
      return formData.password
        ? formData.password.length >= 6
          ? undefined
          : 'Password must be at least 6 characters'
        : 'Password is required';
    case 'confirmPassword':
      return formData.confirmPassword
        ? formData.confirmPassword === formData.password
          ? undefined
          : 'Passwords do not match'
        : 'Confirm Password is required';
    case 'dateOfBirth':
      return formData.dateOfBirth
        ? undefined
        : 'Date of Birth is required';
    case 'gender':
      return formData.gender
        ? undefined
        : 'Gender is required';
    case 'address':
      return formData.address.trim()
        ? undefined
        : 'Address is required';
    case 'city':
      return formData.city.trim()
        ? undefined
        : 'City is required';
    case 'pincode':
      return formData.pincode.trim()
        ? undefined
        : 'Pincode is required';
    case 'agreesToTerms':
      return formData.agreesToTerms
        ? undefined
        : 'You must agree to the terms';
    default:
      return undefined;
  }
};

// --- Step validator ---
export const validateStep = (
  step: number,
  formData: RegisterFormData
): ValidationErrors => {
  const stepFields: Record<number, (keyof RegisterFormData)[]> = {
    1: ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender'],
    2: ['email', 'password', 'confirmPassword', 'address', 'city', 'pincode'],
    3: ['agreesToTerms'],
  };

  const errors: ValidationErrors = {};
  stepFields[step].forEach((field) => {
    const errorMsg = validateField(field, formData);
    if (errorMsg) errors[field] = errorMsg;
  });

  return errors;
};
