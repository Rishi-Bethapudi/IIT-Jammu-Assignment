import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LogIn,
  EyeOff,
  View,
  TriangleAlert,
  Mail,
  Lock,
  Phone,
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
import { useNavigate, Link } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
  phone?: string;
  rememberMe: boolean;
  acceptTerms: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  phone?: string;
  acceptTerms?: string;
}

export default function LoginComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    phone: '',
    rememberMe: false,
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const validateField = (
    field: keyof LoginFormData,
    value: string | boolean
  ): string => {
    switch (field) {
      case 'email':
        if (loginMethod === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value || !emailRegex.test(value as string)) {
            return 'Please enter a valid email address';
          }
        }
        return '';
      case 'phone':
        if (loginMethod === 'phone') {
          const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
          if (!value || !phoneRegex.test(value as string)) {
            return 'Please enter a valid phone number';
          }
        }
        return '';
      case 'password':
        if (!value || (value as string).length < 6) {
          return 'Password must be at least 6 characters long';
        }
        return '';
      case 'acceptTerms':
        if (!value) {
          return 'You must accept the terms and conditions to continue';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (
    field: keyof LoginFormData,
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

    if (loginMethod === 'email') {
      const emailError = validateField('email', formData.email);
      if (emailError) newErrors.email = emailError;
    } else {
      const phoneError = validateField('phone', formData.phone || '');
      if (phoneError) newErrors.phone = phoneError;
    }

    const passwordError = validateField('password', formData.password);
    if (passwordError) newErrors.password = passwordError;

    const acceptTermsError = validateField('acceptTerms', formData.acceptTerms);
    if (acceptTermsError) newErrors.acceptTerms = acceptTermsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapErrorToMessage = (error: any): string => {
    const errorCode = error?.response?.data?.code || error?.response?.status;
    const errorMessage = error?.response?.data?.message || error?.message;

    switch (errorCode) {
      case 401:
      case 'INVALID_CREDENTIALS':
        return 'Invalid credentials. Please check your information and try again.';
      case 422:
      case 'VALIDATION_ERROR':
        return errorMessage || 'Please check your input and try again.';
      case 429:
      case 'RATE_LIMIT':
        return 'Too many attempts. Please wait a moment before trying again.';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection and try again.';
      case 'ACCOUNT_LOCKED':
        return 'Account temporarily locked due to multiple failed attempts. Please try again later.';
      case 'ACCOUNT_NOT_VERIFIED':
        return 'Please verify your account before logging in. Check your email for verification instructions.';
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
      const payload = {
        [loginMethod]:
          loginMethod === 'email'
            ? formData.email.toLowerCase().trim()
            : formData.phone?.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
        loginMethod,
      };

      const response = await axios.post('/api/auth/login', payload);
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('authToken', token);

      // Save to Redux store
      dispatch(setAuth({ token, user }));

      // Show success message
      toast.success('Welcome back! You have been logged in successfully.');

      // Redirect to vegetables page
      navigate('/vegetables');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = mapErrorToMessage(error);
      setSubmitError(errorMessage);

      // Focus on first error field
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

  const isFormValid = () => {
    const hasValidCredential =
      loginMethod === 'email'
        ? formData.email.includes('@')
        : formData.phone && formData.phone.length >= 10;

    return (
      hasValidCredential &&
      formData.password.length >= 6 &&
      formData.acceptTerms
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card shadow-lg border border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 justify-center mb-2">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue shopping for fresh vegetables.
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

          {/* Login Method Toggle */}
          <div className="mb-4">
            <Label className="text-sm font-medium">Login with:</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLoginMethod('email')}
                disabled={isLoading}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button
                type="button"
                variant={loginMethod === 'phone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLoginMethod('phone')}
                disabled={isLoading}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-1" />
                Phone
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMethod === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${
                      errors.email
                        ? 'border-destructive focus:ring-destructive'
                        : ''
                    }`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <TriangleAlert className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`pl-10 ${
                      errors.phone
                        ? 'border-destructive focus:ring-destructive'
                        : ''
                    }`}
                    autoComplete="tel"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <TriangleAlert className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className={`pl-10 pr-10 ${
                    errors.password
                      ? 'border-destructive focus:ring-destructive'
                      : ''
                  }`}
                  autoComplete="current-password"
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

            <div className="space-y-3">
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange('acceptTerms', checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <TriangleAlert className="h-3 w-3" />
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
