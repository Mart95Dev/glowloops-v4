import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Définition des variantes du bouton avec class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilas-clair focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-lilas-fonce text-white hover:bg-lilas-fonce/90",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-100 text-gray-800",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
        link: "text-lilas-fonce underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading = false, asChild = false, children, ...props }, ref) => {
    // Correction pour éviter l'erreur avec React.Children.only
    const shouldUseSlot = asChild && children !== undefined && children !== null;
    
    // Utiliser Slot uniquement si asChild est true et children existe
    const Comp = shouldUseSlot ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
