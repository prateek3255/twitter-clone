'use client'; // Error components must be Client Components
import { ButtonOrLink } from "components/ButtonOrLink";
 
export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 items-center">
      <h1 className="font-bold text-3xl text-white">Something went wrong!</h1>
      <ButtonOrLink
        size="large"
        className="w-full"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </ButtonOrLink>
    </div>
  );
}