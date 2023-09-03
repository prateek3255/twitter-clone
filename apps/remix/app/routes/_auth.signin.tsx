import { FloatingInput } from "ui";
import { Link } from "@remix-run/react";
import { ButtonOrLink } from "components/ButtonOrLink";

export default function Signin() {
  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">Sign in to Twitter</h1>
      <form>
        <div className="flex flex-col gap-4 mb-8">
          <FloatingInput
            autoFocus
            label="Username or Email"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="john@doe.com"
          />
          <FloatingInput
            required
            label="Password"
            id="password"
            name="password"
            placeholder="********"
            type="password"
          />
        </div>
        <ButtonOrLink type="submit" size="large" stretch>
          Sign In
        </ButtonOrLink>
        <div className="text-center text-white text-base w-full mt-4 font-medium">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline" prefetch="intent">
            Sign up
          </Link>
        </div>
      </form>
    </>
  );
}
