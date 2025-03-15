import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-lg text-white transition ${
          variant === "default" ? "bg-blue-600 hover:bg-blue-700" : ""
        } ${variant === "ghost" ? "bg-transparent text-gray-900 hover:bg-gray-200" : ""} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
