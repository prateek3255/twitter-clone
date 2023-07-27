"use client";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonOrLink } from "components/ButtonOrLink";

export const TweetCTA = () => {
  const { pending } = useFormStatus();

  return (
    <ButtonOrLink
      variant="primary"
      size="small"
      type="submit"
      disabled={pending}
    >
      Tweet
    </ButtonOrLink>
  );
};
