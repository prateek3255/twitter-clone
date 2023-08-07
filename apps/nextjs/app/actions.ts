"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserId } from "utils/auth";
import { getTweetsByUsername } from "utils/tweet";
import { prisma } from "utils/db";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  // Sleep for 200 ms
  await new Promise((resolve) => setTimeout(resolve, 2000));
  cookies().set({
    name: "auth",
    value: "",
    expires: new Date("2016-10-05"),
    path: "/", // For all paths
  });
  redirect("/signin");
};

export const createTweet = async (formData: FormData) => {
  const userId = getUserId();
  const tweet = formData.get("tweet") as string;
  await prisma.tweet.create({
    data: {
      content: tweet,
      authorId: userId,
    },
  });
  revalidatePath("/[username]");
};

export const fetchNextUserTweetsPage = async (
  username: string,
  cursor?: string
) => {
  const tweets = await getTweetsByUsername(username, cursor);
  return tweets;
};

export const toggleTweetLike = async ({
  tweetId,
  hasLiked,
}: {
  tweetId: string;
  hasLiked: boolean;
}) => {
  const userId = getUserId();
  if (hasLiked) {
    await prisma.tweetLike.create({
      data: {
        tweetId,
        userId,
      },
    });
  } else {
    await prisma.tweetLike.deleteMany({
      where: {
        tweetId,
        userId,
      },
    });
  }
  revalidatePath("status/[id]");
};

export const toggleTweetRetweet = async ({
  tweetId,
  hasRetweeted,
}: {
  tweetId: string;
  hasRetweeted: boolean;
}) => {
  const userId = getUserId();
  if (hasRetweeted) {
    await prisma.tweet.create({
      data: {
        content: "",
        authorId: userId,
        retweetOfId: tweetId,
      },
    });
  } else {
    await prisma.tweet.deleteMany({
      where: {
        authorId: userId,
        retweetOfId: tweetId,
      },
    });
  }
  // Sleep for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  revalidatePath("status/[id]");
};
