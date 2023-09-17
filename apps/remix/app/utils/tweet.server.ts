import { prisma } from "~/utils/db.server";
import { getUserSession } from "~/utils/auth.server";

export const createTweet = async (request: Request, tweet: string) => {
  const userId = await getUserSession(request);
  if (!userId) {
    throw new Error("User not found");
  }
  await prisma.tweet.create({
    data: {
      content: tweet,
      authorId: userId,
    },
  });
};

export const replyToTweet = async ({
  request,
  replyToTweetId,
  content,
}: {
  request: Request;
  replyToTweetId: string;
  content: string;
}) => {
  const userId = await getUserSession(request);
  if (!userId) {
    throw new Error("User not logged in")
  }
  await prisma.tweet.create({
    data: {
      content,
      authorId: userId,
      replyToId: replyToTweetId,
    },
  });

  return { success: true };
};

export const toggleTweetLike = async ({
  request,
  tweetId,
  hasLiked,
}: {
  request: Request;
  tweetId: string;
  hasLiked: boolean;
}) => {
  const userId = await getUserSession(request);
  if (!userId) {
    throw new Error("User not logg")
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
  return { success: true };
};

export const toggleTweetRetweet = async ({
  request,
  tweetId,
  hasRetweeted,
}: {
  request: Request;
  tweetId: string;
  hasRetweeted: boolean;
}) => {
  const userId = await getUserSession(request);
  if (!userId) {
    throw new Error("User not logg")
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
  return { success: true };
};
