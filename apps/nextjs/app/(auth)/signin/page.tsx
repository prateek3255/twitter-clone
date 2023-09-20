import { FloatingInput } from "ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  decodeValueAndErrors,
  comparePassword,
  encodeValueAndErrors,
  setAuthCookie,
} from "utils/auth";
import { SubmitButton } from "../components/SubmitButton";
import { prisma } from "utils/db";
import { isEmail } from "utils/common";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Twitter Clone",
};

export default function Signin({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const signin = async (formData: FormData) => {
    "use server";
    const auth = {
      usernameOrEmail: formData.get("usernameOrEmail")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };
    const isUsername = !isEmail(auth.usernameOrEmail);
    // Find an account
    const user = await prisma.user.findFirst({
      where: {
        [isUsername ? "username" : "email"]: auth.usernameOrEmail,
      },
    });

    if (!user) {
      const error = encodeValueAndErrors({
        fieldErrors: {
          usernameOrEmail: `No account found with the given ${
            isUsername ? "username" : "email"
          }`,
        },
        fieldValues: auth,
      });
      return redirect(`/signin?${error}`);
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(
      auth.password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      const error = encodeValueAndErrors({
        fieldErrors: {
          password: "Incorrect password",
        },
        fieldValues: auth,
      });
      return redirect(`/signin?${error}`);
    }

    // Set auth cookie
    setAuthCookie({
      userId: user.id,
    });
    return redirect("/");
  };

  const { fieldErrors, fieldValues } = decodeValueAndErrors({
    fieldErrors: searchParams.fieldErrors,
    fieldValues: searchParams.fieldValues,
  });

  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">Sign in to Twitter</h1>
      <form action={signin}>
        <div className="flex flex-col gap-4 mb-8">
          <FloatingInput
            autoFocus
            label="Username or Email"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="john@doe.com"
            defaultValue={fieldValues?.usernameOrEmail}
            error={fieldErrors?.usernameOrEmail}
            aria-invalid={Boolean(fieldErrors?.usernameOrEmail)}
            aria-errormessage={fieldErrors?.usernameOrEmail ?? undefined}
          />
          <FloatingInput
            required
            label="Password"
            id="password"
            name="password"
            placeholder="********"
            type="password"
            defaultValue={fieldValues?.password}
            error={fieldErrors?.password}
            aria-invalid={Boolean(fieldErrors?.password)}
            aria-errormessage={fieldErrors?.password ?? undefined}
          />
        </div>
        <SubmitButton>Sign In</SubmitButton>
        <div className="text-center text-white text-base w-full mt-4 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className=" underline">
            Sign up
          </Link>
        </div>
      </form>
    </>
  );
}
