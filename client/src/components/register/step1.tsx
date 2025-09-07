import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Phone,
  Calendar as CalendarIcon,
  TriangleAlert,
} from 'lucide-react';
import DatePickerField from './DatePickerField';

interface Step1Props {
  formData: any;
  errors: any;
  isLoading: boolean;
  handleInputChange: (field: string, value: string | boolean) => void;
}

const Step1: React.FC<Step1Props> = ({
  formData,
  errors,
  isLoading,
  handleInputChange,
}) => {
  return (
    <div className="space-y-4">
      {/* First Name / Last Name */}
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label>First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`pl-10 ${
                errors.firstName ? 'border-destructive' : ''
              }`}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label>Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`pl-10 ${errors.lastName ? 'border-destructive' : ''}`}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <DatePickerField
            value={formData.dateOfBirth}
            onChange={(value) => handleInputChange('dateOfBirth', value)}
            disabled={isLoading}
          />
        </div>
        {errors.dateOfBirth && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.dateOfBirth}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step1;
