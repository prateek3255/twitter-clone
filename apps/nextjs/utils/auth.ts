import { ZodError } from "zod";
import qs from "qs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import 'server-only';

export const getFlattenedZodErrors = (error: ZodError): Record<string, string> => {
  const fieldErrors = Object.entries(error.flatten().fieldErrors ?? {}).reduce(
    (acc, [field, fieldError]) => {
      if (Array.isArray(fieldError) && fieldError?.length > 0) {
        acc[field] = fieldError[0];
      }
      return acc;
    },
    {} as Record<string, string>
  );
  return fieldErrors;
};

export const encodeValueAndErrors = ({
  fieldValues,
  fieldErrors,
}: {
  fieldValues?: Record<string, string>;
  fieldErrors?: Record<string, string>;
}) => {
  const errorQuery = {
    fieldErrors: encodeURIComponent(JSON.stringify(fieldErrors)),
    fieldValues: encodeURIComponent(JSON.stringify(fieldValues)),
  };

  return qs.stringify(errorQuery);
};

export const decodeValueAndErrors = ({
  fieldValues,
  fieldErrors,
}: {
  fieldValues: string;
  fieldErrors: string;
}) => {
  try {
    const decodedFieldValues = JSON.parse(decodeURIComponent(fieldValues));
    const decodedFieldErrors = JSON.parse(decodeURIComponent(fieldErrors));
    return {
      fieldValues: decodedFieldValues,
      fieldErrors: decodedFieldErrors,
    };
  } catch (error) {
    return {
      fieldValues: {},
      fieldErrors: {},
    };
  }
};

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

export const setAuthCookie = ({ userId }: { userId: string }) => {
  const signedToken = jwt.sign({ userId }, process.env.COOKIE_SECRET ?? "", {
    expiresIn: "7d",
  });

  cookies().set({
    name: "auth",
    value: signedToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const isAuthenticated = () => {
  try {
    const cookie = cookies().get("auth")?.value ?? "";
    jwt.verify(cookie, process.env.COOKIE_SECRET ?? "");
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserId = () => {
  const cookie = cookies().get("auth")?.value ?? "";
  const decodedToken = jwt.decode(cookie);
  if (typeof decodedToken === "string" || typeof decodedToken?.userId !== 'string') {
    return null;
  }
  return decodedToken?.userId;
}

export const clearAuthCookie = () => {
  cookies().set({
    name: "auth",
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date('2016-10-05')
  });
};
