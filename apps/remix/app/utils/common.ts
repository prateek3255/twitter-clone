import type { ZodError } from "zod";

export const isEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDistanceForTweet = (fomattedDate: string) => {
  const [amount, unit] = fomattedDate.split(" ");
  return `${amount}${unit[0]}`;
};

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
