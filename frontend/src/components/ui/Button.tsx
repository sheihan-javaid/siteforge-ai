import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const base = [
      "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
      "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
      "select-none overflow-hidden",
    ].join(" ");

    const variants = {
      primary: [
        "bg-gradient-to-r from-sky-500 to-cyan-500 text-white",
        "shadow-lg shadow-sky-500/25",
        "hover:from-sky-400 hover:to-cyan-400",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/35",
        "active:translate-y-0 active:shadow-md",
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
      ].join(" "),

      secondary: [
        "bg-white/5 text-white/70 border border-white/10",
        "hover:bg-white/10 hover:text-white hover:border-white/20",
        "hover:-translate-y-0.5",
        "active:translate-y-0",
      ].join(" "),

      ghost: [
        "bg-transparent text-white/50",
        "hover:bg-white/6 hover:text-white/80",
        "active:bg-white/10",
      ].join(" "),

      danger: [
        "bg-gradient-to-r from-red-500 to-rose-500 text-white",
        "shadow-lg shadow-red-500/20",
        "hover:from-red-400 hover:to-rose-400",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30",
        "active:translate-y-0",
      ].join(" "),
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs tracking-wide",
      md: "px-4 py-2 text-sm tracking-wide",
      lg: "px-6 py-3 text-sm tracking-wider",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="opacity-70">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;