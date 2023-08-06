"use client"; // Error components must be Client Components
import { useTransition } from "react";
import { ButtonOrLink } from "components/ButtonOrLink";
import { TwitterLogo } from "ui/icons";
import { logout } from "./actions";

export default function Error() {
  const [isPending, startTransition] = useTransition();
  return (
    <main className="flex h-full w-full justify-center items-center">
      <div className="max-w-md w-full border border-solid border-gray-400 rounded-xl px-10 pt-5 pb-8">
        <div className="w-100 flex justify-center mb-4 text-white">
          <TwitterLogo aria-label="Twitter logo" />
        </div>
        <div className="flex flex-col gap-8 items-center">
          <h1 className="font-bold text-3xl text-white">
            Something went wrong!
          </h1>
          <ButtonOrLink
            size="large"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await logout();
              });
            }}
          >
            Try again
          </ButtonOrLink>
        </div>
      </div>
    </main>
  );
}
