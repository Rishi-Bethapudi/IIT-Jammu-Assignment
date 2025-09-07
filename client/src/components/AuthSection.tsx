import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LogIn,
  UserRound,
  EyeOff,
  View,
  TriangleAlert,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { setAuth } from '@/store/authSlice';
import type { AppDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';
interface AuthSectionProps {
  mode: 'register' | 'login';
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthSection({ mode }: AuthSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateField = (
    field: keyof FormData,
    value: string | boolean
  ): string => {
    switch (field) {
      case 'name':
        if (
          mode === 'register' &&
          (!value || (value as string).trim().length < 2)
        ) {
          return 'Name must be at least 2 characters long';
        }
        return '';
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
      case 'confirmPassword':
        if (mode === 'register' && value !== formData.password) {
          return 'Passwords do not match';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear submit error when user modifies form
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (mode === 'register') {
      const nameError = validateField('name', formData.name);
      if (nameError) newErrors.name = nameError;

      const confirmPasswordError = validateField(
        'confirmPassword',
        formData.confirmPassword
      );
      if (confirmPasswordError)
        newErrors.confirmPassword = confirmPasswordError;
    }

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField('password', formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapErrorToMessage = (error: any): string => {
    const errorCode = error?.response?.data?.code || error?.response?.status;
    const errorMessage = error?.response?.data?.message || error?.message;

    switch (errorCode) {
      case 409:
      case 'EMAIL_EXISTS':
        return 'An account with this email already exists. Please use a different email or try logging in.';
      case 401:
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 422:
      case 'VALIDATION_ERROR':
        return errorMessage || 'Please check your input and try again.';
      case 429:
      case 'RATE_LIMIT':
        return 'Too many attempts. Please wait a moment before trying again.';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection and try again.';
      default:
        if (
          errorMessage?.includes('network') ||
          errorMessage?.includes('timeout')
        ) {
          return 'Connection failed. Please check your internet connection and try again.';
        }
        return errorMessage || 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const endpoint =
        mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        mode === 'register'
          ? {
              name: formData.name.trim(),
              email: formData.email.toLowerCase().trim(),
              password: formData.password,
            }
          : {
              email: formData.email.toLowerCase().trim(),
              password: formData.password,
              rememberMe: formData.rememberMe,
            };

      const response = await axios.post(endpoint, payload);
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('authToken', token);

      // Save to Redux store
      dispatch(setAuth({ token, user }));

      // Show success message
      toast.success(
        mode === 'register'
          ? 'Account created successfully! Welcome to our vegetable shop.'
          : 'Welcome back! You have been logged in successfully.'
      );

      // Redirect to vegetables page
      navigate('/vegetables');
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      const errorMessage = mapErrorToMessage(error);
      setSubmitError(errorMessage);

      // Focus on first error field or submit button
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(
          `input[name="${firstErrorField}"]`
        ) as HTMLInputElement;
        element?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'register' ? 'login' : 'register';
    navigate(`/${newMode}`);
  };

  const isFormValid =
    mode === 'register'
      ? formData.name.trim().length >= 2 &&
        formData.email.includes('@') &&
        formData.password.length >= 6 &&
        formData.password === formData.confirmPassword
      : formData.email.includes('@') && formData.password.length >= 6;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card shadow-lg border border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 justify-center mb-2">
            {mode === 'register' ? (
              <UserRound className="h-6 w-6 text-primary" />
            ) : (
              <LogIn className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'register'
              ? 'Join our fresh vegetable marketplace and start shopping for quality produce.'
              : 'Sign in to your account to continue shopping for fresh vegetables.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitError && (
            <Alert className="mb-4 border-destructive/50 bg-destructive/10">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={
                    errors.name
                      ? 'border-destructive focus:ring-destructive'
                      : ''
                  }
                  autoComplete="name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <TriangleAlert className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={
                  errors.email
                    ? 'border-destructive focus:ring-destructive'
                    : ''
                }
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <TriangleAlert className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className={
                    errors.password
                      ? 'border-destructive focus:ring-destructive pr-10'
                      : 'pr-10'
                  }
                  autoComplete={
                    mode === 'register' ? 'new-password' : 'current-password'
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <View className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <TriangleAlert className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className={
                      errors.confirmPassword
                        ? 'border-destructive focus:ring-destructive pr-10'
                        : 'pr-10'
                    }
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <View className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <TriangleAlert className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    handleInputChange('rememberMe', checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-muted-foreground"
                >
                  Remember me for 30 days
                </Label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {mode === 'register'
                    ? 'Creating Account...'
                    : 'Signing In...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {mode === 'register' ? (
                    <BadgeCheck className="h-4 w-4" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {mode === 'register' ? 'Create Account' : 'Sign In'}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'register'
                ? 'Already have an account?'
                : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
                disabled={isLoading}
              >
                {mode === 'register' ? 'Sign in here' : 'Create one here'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
