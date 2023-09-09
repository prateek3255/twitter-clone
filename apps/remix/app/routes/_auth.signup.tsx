import { ButtonOrLink } from "components/ButtonOrLink";
import { FloatingInput } from "ui";
import { Link } from "@remix-run/react";

export default function Signup() {
  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">
        Create your account
      </h1>
      <form>
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <FloatingInput
              required
              autoFocus
              label="Name"
              id="name"
              name="name"
              maxLength={40}
              placeholder="John"
            />
            <FloatingInput
              required
              label="Username"
              id="username"
              name="username"
              minLength={2}
              maxLength={15}
              pattern="^[a-zA-Z0-9_]{1,15}$"
              placeholder="johndoe"
            />
          </div>
          <FloatingInput
            required
            type="email"
            label="Email"
            id="email"
            name="email"
            placeholder="john@doe.com"
          />
          <FloatingInput
            type="password"
            label="Password"
            id="password"
            name="password"
            required
            placeholder="********"
          />
        </div>

        <ButtonOrLink type="submit" size="large" stretch>
          Sign Up
        </ButtonOrLink>

        <ButtonOrLink variant="secondary" size="large" className="w-full mt-4">
          Sign Up with a burner account
        </ButtonOrLink>

        <div className="text-center text-white text-base w-full mt-4 font-medium">
          Already have an account?{" "}
          <Link to="/signin" className=" underline" prefetch="intent">
            Sign in
          </Link>
        </div>
      </form>
    </>
  );
}
