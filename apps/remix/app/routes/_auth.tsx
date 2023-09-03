import { Outlet } from "@remix-run/react";
import { TwitterLogo } from "ui";
// import { isAuthenticated } from "../../utils/auth";
// import { redirect } from "next/navigation";

export default function AuthLayout() {
//   if (isAuthenticated()) {
//     redirect("/");
//   }

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
