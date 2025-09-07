import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { LogIn, EyeOff, View, TriangleAlert, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { setAuth } from '../store/authSlice';
import type { AppDispatch } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import {
  validateLoginForm,
  validateField,
  type LoginFormData,
  type ValidationErrors,
} from '../utils/loginValidators';

export default function LoginComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear submit error when user makes any change
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      acceptTerms: validateField('acceptTerms', formData.acceptTerms),
    };

    // Remove empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    ) as ValidationErrors;

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const mapErrorToMessage = (error: any): string => {
    const errorCode = error?.response?.data?.code || error?.response?.status;
    const errorMessage = error?.response?.data?.message || error?.message;

    switch (errorCode) {
      case 401:
      case 'INVALID_CREDENTIALS':
        return 'Invalid credentials. Please check your email and password.';
      case 422:
      case 'VALIDATION_ERROR':
        return errorMessage || 'Please check your input and try again.';
      case 429:
      case 'RATE_LIMIT':
        return 'Too many attempts. Please wait a moment before trying again.';
      case 'ACCOUNT_LOCKED':
        return 'Account temporarily locked. Please try again later.';
      case 'ACCOUNT_NOT_VERIFIED':
        return 'Please verify your account before logging in.';
      default:
        if (errorMessage?.toLowerCase().includes('network')) {
          return 'Connection failed. Please check your internet connection.';
        }
        return (
          errorMessage || 'An unexpected error occurred. Please try again.'
        );
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
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      };

      const response = await axios.post('/api/auth/login', payload, {
        withCredentials: true,
      });

      const { user, token } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        dispatch(setAuth({ token, user }));
      } else {
        dispatch(setAuth({ token: 'cookie_set', user }));
      }

      toast.success('Welcome back! Logged in successfully.');
      navigate('/vegetables');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = mapErrorToMessage(error);
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    return (
      !validateField('email', formData.email) &&
      !validateField('password', formData.password) &&
      !validateField('acceptTerms', formData.acceptTerms)
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
            Sign in to continue shopping for fresh vegetables.
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
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
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
