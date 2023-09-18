"use client";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonOrLink, type ButtonOrLinkProps } from "components/ButtonOrLink";

export const SubmitButton = ({ children, variant = 'primary' }: { children?: React.ReactNode; variant?: ButtonOrLinkProps["variant"] }) => {
  const { pending } = useFormStatus();

  return (
    <ButtonOrLink
      type="submit"
      size="large"
      className="w-full"
      variant={variant}
      disabled={pending}
    >
      {children ?? "Submit"}
    </ButtonOrLink>
  );
};
