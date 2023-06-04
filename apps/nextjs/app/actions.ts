"use server";
import { cookies } from "next/headers";
import { getUserId } from "utils/auth";
import { prisma } from "utils/db";

export const logout = async () => {
  cookies().set({
    name: "auth",
    value: "",
    expires: new Date("2016-10-05"),
    path: "/", // For all paths
  });
};

export const createTweet = async (formData: FormData) => {
  const userId = getUserId();
  const tweet = formData.get("tweet") as string;
  await prisma.tweet.create({
    data: {
      content: tweet,
      authorId: userId,
    }
  })
}
