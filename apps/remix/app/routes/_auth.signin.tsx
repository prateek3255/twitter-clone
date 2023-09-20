import { FloatingInput } from "ui";
import { Link, useActionData, Form, useNavigation } from "@remix-run/react";
import { json, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { ButtonOrLink } from "~/components/ButtonOrLink";
import {prisma} from "~/utils/db.server";
import { isEmail } from "~/utils/common";
import { createUserSession, comparePassword } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In | Twitter Clone", },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const usernameOrEmail = form.get("usernameOrEmail")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";
  
  const isUsername = !isEmail(usernameOrEmail);
  // Find an account
  const user = await prisma.user.findFirst({
    where: {
      [isUsername ? "username" : "email"]: usernameOrEmail,
    },
  });

  const fields = {
    usernameOrEmail,
    password,
  };

  if(!user) {
    return json({
      fields,
      fieldErrors: {
        usernameOrEmail: `No account found with the given ${
          isUsername ? "username" : "email"
        }`,
        password: null,
      },
    }, {
      status: 400
    })
  }

  const isPasswordCorrect = await comparePassword(password, user.passwordHash);

  if(!isPasswordCorrect) {
    return json({
      fields,
      fieldErrors: {
        usernameOrEmail: null,
        password: "Incorrect password",
      },
    }, {
      status: 400
    })
  }

  return createUserSession(user.id, "/");

}


export default function Signin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">Sign in to Twitter</h1>
      <Form method="post">
        <div className="flex flex-col gap-4 mb-8">
          <FloatingInput
            autoFocus
            label="Username or Email"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="john@doe.com"
            defaultValue={actionData?.fields?.usernameOrEmail ?? ""}
            error={actionData?.fieldErrors?.usernameOrEmail ?? undefined}
            aria-invalid={Boolean(actionData?.fieldErrors?.usernameOrEmail)}
            aria-errormessage={actionData?.fieldErrors?.usernameOrEmail ?? undefined}
          />
          <FloatingInput
            required
            label="Password"
            id="password"
            name="password"
            placeholder="********"
            type="password"
            defaultValue={actionData?.fields?.password ?? ""}
            error={actionData?.fieldErrors?.password ?? undefined}
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-errormessage={actionData?.fieldErrors?.password ?? undefined}
          />
        </div>
        <ButtonOrLink type="submit" size="large" stretch disabled={navigation.state === "submitting"}>
          Sign In
        </ButtonOrLink>
        <div className="text-center text-white text-base w-full mt-4 font-medium">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline" prefetch="intent">
            Sign up
          </Link>
        </div>
      </Form>
    </>
  );
}
