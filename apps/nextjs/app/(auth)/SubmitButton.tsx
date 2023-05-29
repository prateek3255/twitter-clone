"use client";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonOrLink } from "components/ButtonOrLink";

export const SubmitButton = ({ children }: { children?: React.ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <ButtonOrLink
      type="submit"
      size="large"
      className="w-full"
      disabled={pending}
    >
      {children ?? "Submit"}
    </ButtonOrLink>
  );
};
