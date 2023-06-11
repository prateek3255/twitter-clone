import { prisma } from "./db";

export const getTweetsByUsername = async (username: string) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        username,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return tweets;
};
