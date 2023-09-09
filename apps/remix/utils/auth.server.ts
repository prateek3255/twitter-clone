import { createCookieSessionStorage, redirect } from "@remix-run/node";

// TODO: This error shouldn't appear, figure out how to fix it
// eslint-disable-next-line turbo/no-undeclared-env-vars
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "auth",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const getUserSession = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return session.get("userId") as string | undefined;
}

export const isAuthenticated = async (request: Request) => {
  const userId = await getUserSession(request);
  return typeof userId === "string";
}

export const createUserSession =  async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
