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
  if (!userId) {
    throw new Error("User not found");
  }
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
  if (!userId) {
    throw new Error("User not found");
  }
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
  if (!userId) {
    throw new Error("User not found");
  }
  if (hasRetweeted) {
    // When creating a retweet original tweet id is passed creating
    // a new tweet
    await prisma.tweet.create({
      data: {
        content: "",
        authorId: userId,
        retweetOfId: tweetId,
      },
    });
  } else {
    // Check if current user is author of the original tweet
    // and the current tweet is not a retweet
    const originalTweet = await prisma.tweet.findFirst({
      where: {
        id: tweetId,
        authorId: userId,
      },
      select: {
        retweetOfId: true,
      }
    });

    const isCurrentTweetOriginal = typeof originalTweet?.retweetOfId !== "string";

    // If the current user is author of the tweet, delete
    // all retweet of the tweet by the author
    if (isCurrentTweetOriginal) {
      const hadRetweeted = await prisma.tweet.deleteMany({
        where: {
          retweetOfId: tweetId,
          authorId: userId,
        },
      });
      if (hadRetweeted.count > 0) {
        return;
      }
    }

    // When deleting a retweet, the tweet id of the retweet is passed
    // so we use it to delete the retweet
    await prisma.tweet.deleteMany({
      where: {
        id: tweetId,
      },
    });
  }
  // Sleep for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  revalidatePath("status/[id]");
};
