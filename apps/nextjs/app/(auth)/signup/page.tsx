import { ButtonOrLink } from "components/ButtonOrLink";
import FloatingInput from "components/FloatingInput";

export default function Web() {
  return (
    <>
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

      <ButtonOrLink variant="secondary" size="large" className="w-full mt-4">
        Sign Up with a burner account
      </ButtonOrLink>
    </>
  );
}
