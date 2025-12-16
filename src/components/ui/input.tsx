"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:ring-offset-2 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

