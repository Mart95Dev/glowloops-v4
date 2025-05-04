import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-lilas-fonce focus:ring-lilas-fonce focus:ring-offset-2",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        <div className="flex flex-col">
          {label && (
            <label 
              htmlFor={props.id} 
              className="text-sm font-medium text-foreground"
            >
              {label}
            </label>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
