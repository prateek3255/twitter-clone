import * as React from "react";
import { Link, type LinkProps as RemixLinkProps } from "@remix-run/react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const buttonOrLink = cva(
  "border border-solid rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        primary:
          "text-white border-transparent bg-primary-blue font-semibold drop-shadow-button-base hover:bg-primary-blue-hover",
        secondary: "text-black bg-white font-semibold hover:bg-gray-100",
        tertiary:
          "text-white px-4 min-h-[36px] text-sm font-semibold border-gray-700 hover:bg-gray-100/10",
        "tertiary-light":
          "text-white px-4 min-h-[36px] text-sm font-semibold border-white hover:bg-white/10",
        "tertiary-danger":
          "text-red-500 px-4 min-h-[36px] text-sm font-semibold border-red-500 hover:bg-red-500/10",
      },
      size: {
        large: "min-w-[52px] min-h-[52px] px-8 text-base",
        small: "min-w-[36px] min-h-[36px] px-4 text-sm",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      stretch: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "small",
      disabled: false,
    },
  }
);

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
    to: string;
    prefetch?: RemixLinkProps["prefetch"];
  };

type ButtonOrLinkProps = ButtonProps | LinkProps;

export const ButtonOrLink = (props: ButtonOrLinkProps) => {
  const classNames = `${buttonOrLink({
    variant: props.variant,
    size: props.size,
    disabled: props.disabled,
    stretch: props.stretch,
  })} ${props.className ?? ""}`;

  if (props.as === "link") {
    const { as, variant, size, disabled, stretch, ...rest } = props;
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <Link {...rest} className={classNames} />;
  }
  const { variant, size, disabled, stretch, ...propsWithoutCVA } = props;
  return <button {...propsWithoutCVA} className={classNames} />;
};
