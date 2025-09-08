// /components/login/types.ts
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  acceptTerms: boolean;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  acceptTerms?: string;
}