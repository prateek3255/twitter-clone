import { Outlet } from "@remix-run/react";
import { TwitterLogo } from "ui";
import { redirect, type LoaderArgs, json } from "@remix-run/node";
import { isAuthenticated } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const isLoggedIn = await isAuthenticated(request);
  if (isLoggedIn) {
    throw redirect("/", 302);
  }
  return json({}, { status: 200 });
}

export default function AuthLayout() {

  return (
    <main className="flex h-full w-full justify-center items-center">
      <div className="max-w-md w-full sm:border sm:border-solid sm:border-gray-400 rounded-xl px-10 pt-5 pb-8">
        <div className="w-100 flex justify-center mb-4 text-white">
          <TwitterLogo aria-label="Twitter logo" />
        </div>
        <Outlet />
      </div>
    </main>
  );
}
