"use server";
import { cookies } from "next/headers";

export const logout = async () => {
  cookies().set({
    name: "auth",
    value: "",
    expires: new Date("2016-10-05"),
    path: "/", // For all paths
  });
};
