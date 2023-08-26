import React from "react";
import { cva } from "class-variance-authority";

interface FloatingTextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const floatingTextArea = cva(
  "h-[160px] w-full rounded-[4px] outline bg-transparent focus:outline-2 text-white text-base px-3 pt-7 floating-text-area",
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

const FloatingTextArea = React.forwardRef<HTMLTextAreaElement, FloatingTextAreaProps>(
  ({ label, className, error, ...rest }, ref) => {
    const classNames = `${floatingTextArea({
      error: !!error,
    })} ${className ?? ""}`;

    return (
      <div>
        <div className="flex flex-col-reverse relative">
          <textarea
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

FloatingTextArea.displayName = "FloatingTextArea";

export { FloatingTextArea };
