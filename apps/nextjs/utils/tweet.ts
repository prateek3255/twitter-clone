import { prisma } from "./db";
import { getUserId, isAuthenticated } from "./auth";
import 'server-only';

export const getTweetsByUsername = async (username: string, cursor?: number) => {
  let userId = undefined;
  if (isAuthenticated()) {
    userId = getUserId();
  }
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        username,
      },
    },
    include: {
      _count: {
        select: {
          likes: true,
          replies: true,
          retweets: true,
        }  
      },
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        }
      }
    },
    take: 4,
    skip: typeof cursor === 'number' ? 1 : 0,
    cursor: typeof cursor === 'number' ? {
      id: cursor,
    } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
  return tweets;
};

export type TweetWithMeta = Awaited<ReturnType<typeof getTweetsByUsername>>[0];
