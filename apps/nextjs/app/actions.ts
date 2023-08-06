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
    },
  });
  revalidatePath("/[username]");
};

export const fetchNextUserTweetsPage = async (
  username: string,
  cursor?: number
) => {
  const tweets = await getTweetsByUsername(username, cursor);
  return tweets;
};

export const toggleTweetLike = async ({
  tweetId,
  hasLiked,
}: {
  tweetId: number;
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
  tweetId: number;
  hasRetweeted: boolean;
}) => {
  const userId = getUserId();
  if (hasRetweeted) {
    await prisma.tweet.create({
      data: {
        content: "",
        authorId: userId,
        retweetId: tweetId,
      },
    });
  } else {
    await prisma.tweet.deleteMany({
      where: {
        authorId: userId,
        retweetId: tweetId,
      },
    });
  }
  // Sleep for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  revalidatePath("status/[id]");
};
