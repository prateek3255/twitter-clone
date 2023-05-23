import React from "react";
import { TwitterLogo } from "ui/icons";
import { isAuthenticated } from "./auth";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAuthenticated()) {
    redirect("/");
  }

  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="max-w-md w-full border border-solid border-gray-400 rounded-xl px-10 pt-5 pb-8">
        <div className="w-100 flex justify-center mb-4 text-white">
          <TwitterLogo aria-label="Twitter logo" />
        </div>
        {children}
      </div>
    </div>
  );
}
