import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lilas-fonce focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-lilas-fonce text-white",
        secondary: "bg-creme-nude text-black",
        outline: "border border-lilas-fonce text-lilas-fonce",
        success: "bg-green-100 text-black",
        warning: "bg-yellow-100 text-black",
        error: "bg-red-300 text-black",
        dore: "bg-dore text-black",
        menthe: "bg-menthe text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
