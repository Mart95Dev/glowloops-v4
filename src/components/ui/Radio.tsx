import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: RadioOption[];
  name: string;
  value?: string;
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, name, value, label, error, helperText, onChange, orientation = 'vertical', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="w-full space-y-1.5" ref={ref} {...props}>
        {label && (
          <div className="block text-sm font-medium text-foreground mb-2">
            {label}
          </div>
        )}
        <div 
          className={cn(
            "flex gap-4",
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            className
          )}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-start space-x-2">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={handleChange}
                  className={cn(
                    "h-4 w-4 border-gray-300 text-lilas-fonce focus:ring-lilas-fonce focus:ring-offset-2",
                    error && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label 
                  htmlFor={`${name}-${option.value}`} 
                  className={cn(
                    "text-sm font-medium text-foreground",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
