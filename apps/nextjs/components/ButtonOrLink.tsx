import * as React from "react";
import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const buttonOrLink = cva("border border-solid rounded-full", {
  variants: {
    variant: {
      primary:
        "text-white min-w-[52px] min-h-[52px] px-8 border-transparent text-base bg-primary-blue font-semibold drop-shadow-button-base hover:bg-primary-blue-hover",
      secondary:
        "text-black bg-white px-4 min-h-[36px] text-sm font-semibold hover:bg-gray-100",
      teritary:
        "text-white px-4 min-h-[36px] text-sm font-semibold border-gray-700 h-fit hover:bg-gray-100/10",
      "tertiary-light":
        "text-white px-4 min-h-[36px] text-sm font-semibold border-white h-fit hover:bg-white/10",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonOrLinkPropsBase = VariantProps<typeof buttonOrLink> & {
  as?: "button" | "link";
};

type ButtonProps = ButtonOrLinkPropsBase &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type LinkProps = ButtonOrLinkPropsBase &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "link";
    href: string;
  };

type ButtonOrLinkProps = ButtonProps | LinkProps;

export const ButtonOrLink = (props: ButtonOrLinkProps) => {
  const classNames = `${buttonOrLink({
    variant: props.variant,
  })} ${props.className ?? ""}`;

  if (props.as === "link") {
    return <Link {...props} className={classNames} />;
  }
  return <button {...props} className={classNames} />;
};
