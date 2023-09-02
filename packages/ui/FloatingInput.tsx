import React from "react";
import { cva } from "class-variance-authority";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const floatingInput = cva(
  "h-[56px] w-full rounded-[4px] outline bg-transparent focus:outline-2 text-white text-base px-3 pt-5 floating-input",
  {
    variants: {
      error: {
        true: "outline-red-400 focus:outline-red-500",
        false: "outline-gray-500 focus:outline-primary-blue",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, error, ...rest }, ref) => {
    const classNames = `${floatingInput({
      error: !!error,
    })} ${className ?? ""}`;

    return (
      <div>
        <div className="flex flex-col-reverse relative">
          <input
            className={classNames}
            aria-invalid={!!error}
            aria-errormessage={error}
            ref={ref}
            {...rest}
          />
          <label htmlFor={rest.id} className="text-gray-500 text-sm">
            {label}
          </label>
        </div>
        {error && (
          <p role="alert" className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
