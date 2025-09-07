import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, MapPin, EyeOff, View } from 'lucide-react';

interface Step2Props {
  formData: any;
  errors: any;
  isLoading: boolean;
  handleInputChange: (field: string, value: string | boolean) => void;
}

const Step2: React.FC<Step2Props> = ({
  formData,
  errors,
  isLoading,
  handleInputChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      {/* Password */}
      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`pl-10 pr-10 ${
              errors.password ? 'border-destructive' : ''
            }`}
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
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label>Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange('confirmPassword', e.target.value)
            }
            className={`pl-10 pr-10 ${
              errors.confirmPassword ? 'border-destructive' : ''
            }`}
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
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label>Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            placeholder="Enter your complete address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full min-h-[80px] px-3 py-2 pl-10 border rounded-md ${
              errors.address ? 'border-destructive' : ''
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address}</p>
        )}
      </div>

      {/* City & Pincode */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            type="text"
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={errors.city ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Pincode</Label>
          <Input
            type="text"
            placeholder="6-digit pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className={errors.pincode ? 'border-destructive' : ''}
            disabled={isLoading}
            maxLength={6}
          />
          {errors.pincode && (
            <p className="text-sm text-destructive">{errors.pincode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2;
