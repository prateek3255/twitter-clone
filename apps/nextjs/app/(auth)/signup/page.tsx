import { ButtonOrLink } from "components/ButtonOrLink";
import FloatingInput from "components/FloatingInput";
import { TwitterLogo } from "ui/icons";

export default function Web() {
  return (
    <div className="max-w-md w-full border border-solid border-gray-400 rounded-xl px-10 pt-5 pb-8">
      <div className="w-100 flex justify-center mb-4 text-white">
        <TwitterLogo aria-label="Twitter logo" />
      </div>
      <h1 className="font-bold text-3xl text-white mb-7">
        Create your account
      </h1>
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex w-full gap-4">
          <FloatingInput autoFocus label="Name" id="name" placeholder="John" />
          <FloatingInput label="Username" id="username" placeholder="johndoe" />
        </div>
        <FloatingInput label="Email" id="email" placeholder="john@doe.com" />
        <FloatingInput label="Password" id="password" placeholder="********" />
      </div>

      <ButtonOrLink size="large" className="w-full">
        Sign Up
      </ButtonOrLink>

      <ButtonOrLink variant='secondary' size="large" className="w-full mt-4">
        Sign Up with a burner account
      </ButtonOrLink>
    </div>
  );
}
