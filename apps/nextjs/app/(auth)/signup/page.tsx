import { ButtonOrLink } from "components/ButtonOrLink";
import { FloatingInput } from "components/FloatingInput";
import { prisma } from "utils/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  decodeValueAndErrors,
  encodeValueAndErrors,
  getFlattenedZodErrors,
  hashPassword,
  setAuthCookie,
} from "utils/auth";
import { SubmitButton } from "../components/SubmitButton";

export default function Signup({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  async function signup(formData: FormData) {
    "use server";
    const user = {
      name: formData.get("name")?.toString() ?? "",
      username: formData.get("username")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };

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

    const parsedUser = signupSchema.safeParse(user);

    if (!parsedUser.success) {
      const fieldErrors = getFlattenedZodErrors(parsedUser.error);
      const errorQuery = encodeValueAndErrors({
        fieldErrors,
        fieldValues: user,
      });

      return redirect(`/signup?${errorQuery}`);
    }

    const res = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: user.email,
          },
          {
            username: user.username,
          },
        ],
      },
    });

    if (res) {
      let fieldErrors: Record<string, string> = {};

      if (res.email === user.email) {
        fieldErrors.email = "Email is already taken";
      }

      if (res.username === user.username) {
        fieldErrors.username = "Username is already taken";
      }

      const errorQuery = encodeValueAndErrors({
        fieldErrors: fieldErrors,
        fieldValues: user,
      });

      return redirect(`/signup?${errorQuery}`);
    }

    const { password, ...rest } = parsedUser.data;
    const passwordHash = await hashPassword(password);
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
    setAuthCookie({
      userId: newUser.id,
    });
    return redirect("/");
  }

  const { fieldErrors, fieldValues } = decodeValueAndErrors({
    fieldErrors: searchParams.fieldErrors,
    fieldValues: searchParams.fieldValues,
  });

  return (
    <>
      <h1 className="font-bold text-3xl text-white mb-7">
        Create your account
      </h1>
      <form action={signup}>
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
              defaultValue={fieldValues?.name}
              error={fieldErrors?.name}
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
              defaultValue={fieldValues?.username}
              error={fieldErrors?.username}
            />
          </div>
          <FloatingInput
            required
            type="email"
            label="Email"
            id="email"
            name="email"
            placeholder="john@doe.com"
            defaultValue={fieldValues?.email}
            error={fieldErrors?.email}
          />
          <FloatingInput
            type="password"
            label="Password"
            id="password"
            name="password"
            required
            placeholder="********"
            defaultValue={fieldValues?.password}
            error={fieldErrors?.password}
          />
        </div>

        <SubmitButton>Sign Up</SubmitButton>

        <ButtonOrLink variant="secondary" size="large" className="w-full mt-4">
          Sign Up with a burner account
        </ButtonOrLink>

        <div className="text-center text-white text-base w-full mt-4 font-medium">
          Already have an account?{" "}
          <Link href="/signin" className=" underline">
            Sign in
          </Link>
        </div>
      </form>
    </>
  );
}
