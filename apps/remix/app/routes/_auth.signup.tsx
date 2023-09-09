import { ButtonOrLink } from "components/ButtonOrLink";
import { FloatingInput } from "ui";
import { z } from "zod";
import { Link, useActionData, Form, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { prisma } from "utils/db.server";
import { getFlattenedZodErrors } from "utils/common";
import { json, type ActionArgs } from "@remix-run/node";
import { createUserSession } from "utils/auth.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const name = form.get("name")?.toString() ?? "";
  const username = form.get("username")?.toString() ?? "";
  const email = form.get("email")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";

  const signupSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" }),
    username: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9_]{1,15}$/, {
        message: "Username can only contain letters, numbers and underscores",
      })
      .min(2, { message: "Username must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  });

  const fields = {
    name,
    username,
    email,
    password,
  };

  const parsedUser = signupSchema.safeParse(fields);

  if (!parsedUser.success) {
    const fieldErrors = getFlattenedZodErrors(parsedUser.error);
    return json(
      {
        fields,
        fieldErrors,
      },
      {
        status: 400,
      }
    );
  }

  const res = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  if (res) {
    let fieldErrors: Record<string, string> = {};

    if (res.email === email) {
      fieldErrors.email = "Email is already taken";
    }

    if (res.username === username) {
      fieldErrors.username = "Username is already taken";
    }

    return json(
      {
        fields,
        fieldErrors,
      },
      {
        status: 400,
      }
    );
  }

  const { password: _, ...rest } = parsedUser.data;
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      ...rest,
      passwordHash,
      // Generate a deterministic profile image using a random number and save it in the database
      profileImage: `https://api.dicebear.com/6.x/big-ears-neutral/png?seed=${Math.random()
        .toString(36)
        .substring(2)}`,
    },
  });

  return createUserSession(newUser.id, "/");
};

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">
        Create your account
      </h1>
      <Form method="post">
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
              defaultValue={actionData?.fields?.name ?? ""}
              error={actionData?.fieldErrors?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={actionData?.fieldErrors?.name ?? undefined}
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
              defaultValue={actionData?.fields?.username ?? ""}
              error={actionData?.fieldErrors?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={actionData?.fieldErrors?.username ?? undefined}
            />
          </div>
          <FloatingInput
            required
            type="email"
            label="Email"
            id="email"
            name="email"
            placeholder="john@doe.com"
            defaultValue={actionData?.fields?.email ?? ""}
            error={actionData?.fieldErrors?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-errormessage={actionData?.fieldErrors?.email ?? undefined}
          />
          <FloatingInput
            type="password"
            label="Password"
            id="password"
            name="password"
            required
            placeholder="********"
            defaultValue={actionData?.fields?.password ?? ""}
            error={actionData?.fieldErrors?.password}
            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
            aria-errormessage={actionData?.fieldErrors?.password ?? undefined}
          />
        </div>

        <ButtonOrLink type="submit" size="large" stretch disabled={navigation.state === "submitting"}>
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
      </Form>
    </>
  );
}
