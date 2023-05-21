import { ZodError } from "zod";
import qs from "qs";
import bcrypt from "bcryptjs";

const getFlattenedZodErrors = (error: ZodError): Record<string, string> => {
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

const encodeValueAndErrors = ({
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

const decodeValueAndErrors = ({
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

const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 10)
    return hash;
}

export { getFlattenedZodErrors, encodeValueAndErrors, decodeValueAndErrors, hashPassword };
