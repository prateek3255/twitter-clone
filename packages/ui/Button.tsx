import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = (props: ButtonProps) => {
  if (props.variant === "primary") {
    return (
      <button className={`min-w-[52px] min-h-[52px] px-8 rounded-full border border-transparent border-solid text-white text-[17px] bg-primary-default font-semibold drop-shadow-button-base hover:bg-primary-hover ${props.className ?? ''}`} {...props} />
    );
  }
  return null;
};
