import { ButtonOrLink } from "components/ButtonOrLink";
import FloatingInput from "components/FloatingInput";

export default function Web() {
  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">
        Sign in to Twitter
      </h1>
      <div className="flex flex-col gap-4 mb-8">
        <FloatingInput autoFocus label="Email" id="email" placeholder="john@doe.com" />
        <FloatingInput label="Password" id="password" placeholder="********" />
      </div>

      <ButtonOrLink size="large" className="w-full">
        Sign In
      </ButtonOrLink>

      <ButtonOrLink variant="secondary" size="large" className="w-full mt-4">
        Sign In with a burner account
      </ButtonOrLink>
    </>
  );
}
