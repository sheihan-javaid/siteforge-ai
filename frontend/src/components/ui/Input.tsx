"use client";

import {
  InputHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className, id, leftIcon, rightIcon, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border bg-background px-3 py-2 transition-all",
            "focus-within:ring-2 focus-within:ring-brand-500",
            "hover:border-muted-foreground/40",
            error
              ? "border-red-500 focus-within:ring-red-500"
              : "border-input"
          )}
        >
          {leftIcon && (
            <span className="text-muted-foreground text-sm">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-transparent text-sm outline-none",
              "placeholder:text-muted-foreground",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {rightIcon && (
            <span className="text-muted-foreground text-sm cursor-pointer">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-500 animate-in"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;