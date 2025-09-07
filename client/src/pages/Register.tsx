import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { UserRound, TriangleAlert, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setAuth } from '@/store/authSlice';
import type { AppDispatch } from '@/store';
import { useNavigate, Link } from 'react-router-dom';

import Step1 from '../components/register/step1';
import Step2 from '../components/register/step2';
import Step3 from '../components/register/step3';

interface RegisterFormData {
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

interface ValidationErrors {
  [key: string]: string | undefined;
}

export default function RegisterComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    pincode: '',
    agreesToTerms: false,
    agreesToMarketing: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Generic field change handler
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError('');
  };

  // Map API errors to friendly messages
  const mapErrorToMessage = (error: any): string => {
    const code = error?.response?.data?.code || error?.response?.status;
    const message = error?.response?.data?.message || error?.message;
    switch (code) {
      case 409:
      case 'EMAIL_EXISTS':
        return 'An account with this email already exists.';
      case 'PHONE_EXISTS':
        return 'An account with this phone number already exists.';
      case 422:
      case 'VALIDATION_ERROR':
        return message || 'Please check your input.';
      default:
        return message || 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError('');

    try {
      const payload = { ...formData };
      const response = await axios.post('/api/auth/register', payload);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      dispatch(setAuth({ token, user }));

      toast.success('Account created successfully!');
      navigate('/vegetables');
    } catch (error: any) {
      setSubmitError(mapErrorToMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information';
      case 2:
        return 'Security & Address';
      case 3:
        return 'Terms & Summary';
      default:
        return 'Create Account';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card shadow-lg border border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 justify-center mb-2">
            <UserRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            {getStepTitle()} - Step {currentStep} of 3
          </CardDescription>

          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
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
            {currentStep === 1 && (
              <Step1
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
              />
            )}
            {currentStep === 2 && (
              <Step2
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
              />
            )}
            {currentStep === 3 && (
              <Step3
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!formData.agreesToTerms || isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
