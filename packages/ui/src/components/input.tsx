import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-text-main font-sans outline-none transition-colors",
          "focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/60",
          "placeholder:text-text-light disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";