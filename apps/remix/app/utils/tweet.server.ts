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
