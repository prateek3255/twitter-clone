import React from "react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = ({ label, className, ...rest }: FloatingInputProps) => {
  return (
    <div className="flex flex-col-reverse relative">
      <input
        className={`h-[56px] w-full rounded-[4px] outline outline-gray-500 bg-transparent focus:outline-primary-blue focus:outline-2 text-white text-base px-3 pt-5 floating-input ${className}`}
        {...rest}
      />
      <label htmlFor={rest.id} className="text-gray-500 text-sm">
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
