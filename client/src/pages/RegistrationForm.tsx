import React, { useState } from 'react';
import { UserRound, TriangleAlert, BadgeCheck, Check } from 'lucide-react';
import RegistrationStep1 from '../components/register/RegistrationStep1';
import RegistrationStep2 from '../components/register/RegistrationStep2';
import RegistrationStep3 from '../components/register/RegistrationStep3';
import { validateStep } from '../components/register/validation';
import type {
  RegisterFormData,
  ValidationErrors,
} from '../components/register/types';
import { registerUser } from '@/services/apiServices';

const RegistrationForm: React.FC = () => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (
    field: keyof RegisterFormData,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all steps
    const step1Errors = validateStep(1, formData);
    const step2Errors = validateStep(2, formData);
    const step3Errors = validateStep(3, formData);

    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // Simulate API call
      const response = await registerUser(formData);
      alert('Account created successfully!');
      // Simulate successful registration
      alert(
        'Account created successfully! Welcome to our vegetable marketplace.'
      );
      if (formData.email && formData.password) {
        localStorage.setItem('prefillEmail', formData.email);
        localStorage.setItem('prefillPassword', formData.password);
      }

      // Redirect to login
      window.location.href = '/login';
      // Reset form
      setFormData({
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
      setCurrentStep(1);
    } catch (error: any) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-8 bg-gradient-to-r from-green-100 to-blue-100 text-white">
          <div className="flex items-center gap-2 justify-center mb-4">
            <UserRound className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h1>
          <p className="text-center  mb-4">
            {getStepTitle()} - Step {currentStep} of 3
          </p>

          {/* Enhanced Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <TriangleAlert className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{submitError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <RegistrationStep1
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onInputChange={handleInputChange}
              />
            )}
            {currentStep === 2 && (
              <RegistrationStep2
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onInputChange={handleInputChange}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
            )}
            {currentStep === 3 && (
              <RegistrationStep3
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onInputChange={handleInputChange}
              />
            )}

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className={`px-6 py-3 bg-gradient-to-r from-green-200 to-blue-200 text-white rounded-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                    currentStep === 1 ? 'w-full' : 'flex-1'
                  }`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  disabled={!formData.agreesToTerms || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <BadgeCheck className="h-4 w-4" />
                      Create Account
                    </div>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
