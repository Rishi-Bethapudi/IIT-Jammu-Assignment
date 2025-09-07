import React from 'react';
import { Lock, MapPin, TriangleAlert, Eye, EyeOff } from 'lucide-react';
import type { RegisterFormData, ValidationErrors } from './types';

interface RegistrationStep2Props {
  formData: RegisterFormData;
  errors: ValidationErrors;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

const RegistrationStep2: React.FC<RegistrationStep2Props> = ({
  formData,
  errors,
  isLoading,
  showPassword,
  showConfirmPassword,
  onInputChange,
  setShowPassword,
  setShowConfirmPassword,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            autoComplete="new-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.password}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters with uppercase, lowercase, and
          number
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.confirmPassword
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            autoComplete="new-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <textarea
            id="address"
            name="address"
            placeholder="Enter your complete address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            className={`w-full min-h-[80px] px-3 py-2 pl-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
              errors.address
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Enter your city"
            value={formData.city}
            onChange={(e) => onInputChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.city
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            autoComplete="address-level2"
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" />
              {errors.city}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="pincode"
            className="text-sm font-medium text-gray-700"
          >
            Pincode
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            placeholder="6-digit pincode"
            value={formData.pincode}
            onChange={(e) => onInputChange('pincode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.pincode
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            autoComplete="postal-code"
            disabled={isLoading}
            maxLength={6}
          />
          {errors.pincode && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" />
              {errors.pincode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep2;
