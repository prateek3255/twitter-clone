"use server";
import { cookies } from "next/headers";
import { getUserId } from "utils/auth";
import { getTweetsByUsername } from "utils/tweet";
import { prisma } from "utils/db";
import { revalidatePath } from "next/cache";

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
  // TODO: Make this dynamic
  revalidatePath("/wolverine")
}

export const fetchNextUserTweetsPage = async (username: string, cursor?: number) => {
  const tweets = await getTweetsByUsername(username, cursor);
  return tweets;
}

export const likeTweet = async (tweetId: number) => {
  const userId = getUserId();
  await prisma.like.create({
    data: {
      tweetId,
      userId,
    }
  })
};
