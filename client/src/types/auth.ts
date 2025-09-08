export interface User {
  _id: string;
  id: string; // For compatibility
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload {
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