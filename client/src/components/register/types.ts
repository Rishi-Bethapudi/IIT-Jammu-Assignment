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

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  pincode?: string;
  agreesToTerms?: string;
}