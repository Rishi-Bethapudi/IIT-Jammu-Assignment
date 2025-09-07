'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    onChange(format(selectedDate, 'yyyy-MM-dd')); // format as string for formData
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <CalendarIcon className="mr-2" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerField;
