import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const button = cva("text-white border border-solid rounded-full", {
  variants: {
    variant: {
      primary:
        "min-w-[52px] min-h-[52px] px-8 border-transparent text-base bg-primary-blue font-semibold drop-shadow-button-base hover:bg-primary-blue-hover",
      teritary:
        "px-4 min-h-[36px] text-sm font-semibold border-gray-700 h-fit hover:bg-gray-100/10",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonProps = VariantProps<typeof button> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${button({
        variant: props.variant,
      })} ${props.className ?? ""}`}
    />
  );
};
