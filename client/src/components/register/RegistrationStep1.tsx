import React, { useState } from 'react';
import {
  User,
  Phone,
  TriangleAlert,
  CalendarIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { RegisterFormData, ValidationErrors } from './types';

interface RegistrationStep1Props {
  formData: RegisterFormData;
  errors: ValidationErrors;
  isLoading: boolean;
  onInputChange: (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => void;
}

const RegistrationStep1: React.FC<RegistrationStep1Props> = ({
  formData,
  errors,
  isLoading,
  onInputChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      onInputChange('dateOfBirth', formattedDate);
      setOpen(false);
    }
  };

  const selectedDate = formData.dateOfBirth
    ? new Date(formData.dateOfBirth)
    : undefined;

  return (
    <div className="space-y-4">
      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.firstName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              autoComplete="given-name"
              disabled={isLoading}
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" />
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.lastName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              autoComplete="family-name"
              disabled={isLoading}
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            autoComplete="tel"
            disabled={isLoading}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <TriangleAlert className="h-3 w-3" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* DOB + Gender */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div className="space-y-2">
          <label
            htmlFor="dateOfBirth"
            className="text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-between font-normal h-10 px-3 py-2 border rounded-md text-sm',
                  !selectedDate && 'text-muted-foreground',
                  errors.dateOfBirth && 'border-red-500 focus:ring-red-500'
                )}
                disabled={isLoading}
              >
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {selectedDate
                    ? format(selectedDate, 'MMM dd, yyyy')
                    : 'Select date'}
                </div>
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => onInputChange('gender', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep1;
