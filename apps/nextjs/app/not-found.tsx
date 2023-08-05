import { ButtonOrLink } from "components/ButtonOrLink";
import { TwitterLogo } from "ui/icons";

export default function Error() {
  return (
    <main className="flex h-full w-full justify-center items-center">
      <div className="max-w-md w-full border border-solid border-gray-400 rounded-xl px-10 pt-5 pb-8">
        <div className="w-100 flex justify-center mb-4 text-white">
          <TwitterLogo aria-label="Twitter logo" />
        </div>
        <div className="flex flex-col gap-8 items-center">
          <h1 className="font-bold text-2xl text-white">
            Hmm...this page doesn’t exist. Try searching for something else.
          </h1>
          <ButtonOrLink size="large" className="w-full" as="link" href="/">
            Go to home
          </ButtonOrLink>
        </div>
      </div>
    </main>
  );
}
