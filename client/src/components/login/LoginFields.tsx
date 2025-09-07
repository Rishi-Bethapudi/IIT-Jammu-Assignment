import React from 'react';
import { EyeOff, View, TriangleAlert, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import type { LoginFormData, ValidationErrors } from './types';

interface LoginFieldsProps {
  formData: LoginFormData;
  errors: ValidationErrors;
  isLoading: boolean;
  showPassword: boolean;
  onInputChange: (field: keyof LoginFormData, value: string | boolean) => void;
  setShowPassword: (show: boolean) => void;
}

const LoginFields: React.FC<LoginFieldsProps> = ({
  formData,
  errors,
  isLoading,
  showPassword,
  onInputChange,
  setShowPassword,
}) => {
  return (
    <>
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
            onChange={(e) => onInputChange('email', e.target.value)}
            className={`pl-10 ${
              errors.email ? 'border-destructive focus:ring-destructive' : ''
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
            onChange={(e) => onInputChange('password', e.target.value)}
            className={`pl-10 pr-10 ${
              errors.password ? 'border-destructive focus:ring-destructive' : ''
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
              onInputChange('rememberMe', checked as boolean)
            }
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Remember me for 30 days
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              onInputChange('acceptTerms', checked as boolean)
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
    </>
  );
};

export default LoginFields;
