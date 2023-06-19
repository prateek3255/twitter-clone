import { prisma } from "./db";

export const getTweetsByUsername = async (username: string, cursor?: number) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        username,
      },
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
