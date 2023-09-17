"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserId } from "utils/auth";
import { prisma } from "utils/db";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  // Sleep for 200 ms
  await new Promise((resolve) => setTimeout(resolve, 200));
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

export const replyToTweet = async ({
  replyToTweetId,
  content,
}: {
  replyToTweetId: string;
  content: string;
}) => {
  const userId = getUserId();
  if (!userId) {
    redirect("/signin");
  }
  await prisma.tweet.create({
    data: {
      content,
      authorId: userId,
      replyToId: replyToTweetId,
    },
  });
  revalidatePath("status/[id]");
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
    redirect("/signin");
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
    redirect("/signin");
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
      },
    });

    const isCurrentTweetOriginal =
      typeof originalTweet?.retweetOfId !== "string";

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
  revalidatePath("status/[id]");
};

export const toggleFollowUser = async ({
  userId,
  isFollowing,
}: {
  userId: string;
  isFollowing: boolean;
}) => {
  const currentUserId = getUserId();
  if (!currentUserId) {
    redirect("/signin");
  }
  if (isFollowing) {
    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        following: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        following: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }
  revalidatePath("/[username]");
};

export const saveProfile = async (formData: FormData) => {
  const loggedInUserId = getUserId();
  if (!loggedInUserId) {
    redirect("/signin");
  }
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  // Check if username is already taken
  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (existingUser && existingUser.id !== loggedInUserId) {
    return { success: false, error: "username_already_taken" };
  }

  // Update user
  await prisma.user.update({
    where: {
      id: loggedInUserId,
    },
    data: {
      username,
      name,
      bio,
    },
  });

  // If username is changed, redirect to new username
  // else revalidate current path
  if (username === existingUser?.username) {
    revalidatePath("/[username]");
  } else {
    redirect(`/${username}`);
  }
};
