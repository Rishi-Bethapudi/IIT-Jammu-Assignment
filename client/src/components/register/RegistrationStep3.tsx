import React from 'react';
import { Check, TriangleAlert } from 'lucide-react';
import type { RegisterFormData, ValidationErrors } from './types';

interface RegistrationStep3Props {
  formData: RegisterFormData;
  errors: ValidationErrors;
  isLoading: boolean;
  onInputChange: (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => void;
}

const RegistrationStep3: React.FC<RegistrationStep3Props> = ({
  formData,
  errors,
  isLoading,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <input
              id="agreesToTerms"
              type="checkbox"
              checked={formData.agreesToTerms}
              onChange={(e) => onInputChange('agreesToTerms', e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            {formData.agreesToTerms && (
              <Check className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none" />
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="agreesToTerms"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              I agree to the Terms and Conditions
            </label>
            <p className="text-xs text-gray-500 mt-1">
              By checking this box, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
              ,{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              , and{' '}
              <a href="/refund" className="text-blue-600 hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </div>
        </div>
        {errors.agreesToTerms && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.agreesToTerms}
          </p>
        )}

        <div className="flex items-start space-x-3">
          <div className="relative">
            <input
              id="agreesToMarketing"
              type="checkbox"
              checked={formData.agreesToMarketing}
              onChange={(e) =>
                onInputChange('agreesToMarketing', e.target.checked)
              }
              disabled={isLoading}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            {formData.agreesToMarketing && (
              <Check className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none" />
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="agreesToMarketing"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Marketing Communications (Optional)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              I would like to receive emails about special offers, new products,
              and seasonal vegetables. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="text-sm font-semibold mb-3 text-gray-800">
          Account Summary
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{formData.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium text-gray-900">{formData.phone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">City:</span>
            <span className="font-medium text-gray-900">{formData.city}</span>
          </div>
          {formData.dateOfBirth && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium text-gray-900">
                {new Date(formData.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep3;
