import { prisma } from "./db";
import { getUserId, isAuthenticated } from "./auth";
import "server-only";

export const getTweetsByUsername = async (
  username: string,
  cursor?: number
) => {
  let userId = undefined;
  if (isAuthenticated()) {
    userId = getUserId();
  }
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        username,
      },
      NOT: {
        // Hide user's own retweets from their profile
        retweetOf: {
          author: {
            username,
          },
        },
      },
    },
    include: {
      _count: {
        select: {
          likes: true,
          replies: true,
          retweets: true,
        },
      },
      retweetOf: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
              retweets: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          retweets: {
            where: {
              authorId: userId,
            },
            select: {
              authorId: true,
            },
          },
        },
      },
      retweets: {
        where: {
          authorId: userId,
        },
        select: {
          authorId: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
    take: 4,
    skip: typeof cursor === "number" ? 1 : 0,
    cursor:
      typeof cursor === "number"
        ? {
            id: cursor,
          }
        : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
  return tweets;
};

export const getTweetWithID = async (id: number) => {
  let userId = undefined;
  if (isAuthenticated()) {
    userId = getUserId();
  }

  const tweet = await prisma.tweet.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          likes: true,
          replies: true,
          retweets: true,
        },
      },
      retweetOf: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
              retweets: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          retweets: {
            where: {
              authorId: userId,
            },
            select: {
              authorId: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
      retweets: {
        where: {
          authorId: userId,
        },
        select: {
          authorId: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  return tweet;
};

export type UserTweetsWithMeta = Awaited<ReturnType<typeof getTweetsByUsername>>[0];

export type TweetWithMeta = NonNullable<Awaited<ReturnType<typeof getTweetWithID>>>;
