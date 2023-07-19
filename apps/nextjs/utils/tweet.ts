import { prisma } from "./db";
import 'server-only';

export const getTweetsByUsername = async (username: string, cursor?: number) => {
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
