import { prisma } from "./db.server";
import { getUserSession } from "./auth.server";

const getTweetFields = (userId?: string | null) =>
  ({
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
              userId: userId ?? undefined,
            },
            select: {
              userId: true,
            },
          },
          retweets: {
            where: {
              authorId: userId ?? undefined,
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
          authorId: userId ?? undefined,
        },
        select: {
          authorId: true,
        },
      },
      likes: {
        where: {
          userId: userId ?? undefined,
        },
        select: {
          userId: true,
        },
      },
    },
  }) as const;

export const getTweetsByUsername = async (
  request: Request,
  username: string,
  cursor?: string,
) => {
  const userId = await getUserSession(request);
  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        username,
      },
      replyToId: null,
      NOT: {
        // Hide user's own retweets from their profile
        retweetOf: {
          author: {
            username,
          },
        },
      },
    },
    ...getTweetFields(userId),
    take: 4,
    skip: typeof cursor === "string" ? 1 : 0,
    cursor:
      typeof cursor === "string"
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

export const getTweetWithID = async (request: Request, id: string) => {
  const userId = await getUserSession(request);
  const tweet = await prisma.tweet.findUnique({
    where: {
      id,
    },
    ...getTweetFields(userId),
  });

  return tweet;
};

export const getTweetReplies = async (request: Request, id: string, cursor?: string) => {
  const userId = await getUserSession(request);
  const tweets = await prisma.tweet.findMany({
    where: {
      replyToId: id,
    },
    ...getTweetFields(userId),
    take: 4,
    skip: typeof cursor === "string" ? 1 : 0,
    cursor:
      typeof cursor === "string"
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

export const getHomeTweets = async (request: Request, cursor?: string) => {
  const userId = await getUserSession(request);
  let followingCount = 0;
  if (typeof userId === "string") {
    const followingQuery = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        _count: {
          select: {
            following: true,
          },
        },
      },
    });
    followingCount = followingQuery?._count?.following ?? 0;
  }

  const hasFollowers = followingCount > 0;

  // Fetch tweets from users that the current user follows
  const tweets = await prisma.tweet.findMany({
    ...(hasFollowers
      ? {
          where: {
            author: {
              followers: {
                some: {
                  id: userId ?? undefined,
                },
              },
            },
          },
        }
      : {}),
    ...getTweetFields(userId),
    take: 4,
    skip: typeof cursor === "string" ? 1 : 0,
    cursor:
      typeof cursor === "string"
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

export const getUserReplies = async (request: Request, username: string, cursor?: string) => {
  const userId = await getUserSession(request);

  const tweets = await prisma.tweet.findMany({
    where: {
      author: {
        username,
      },
      replyToId: {
        not: null,
      },
    },
    ...getTweetFields(userId),
    take: 4,
    skip: typeof cursor === "string" ? 1 : 0,
    cursor:
      typeof cursor === "string"
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

export const getUserLikes = async (request: Request, username: string, cursor?: string) => {
  const userId = await getUserSession(request);

  const tweets = await prisma.tweet.findMany({
    where: {
      likes: {
        some: {
          user: {
            username,
          }
        }
      },
    },
    ...getTweetFields(userId),
    take: 4,
    skip: typeof cursor === "string" ? 1 : 0,
    cursor:
      typeof cursor === "string"
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

export type TweetWithMeta = Awaited<
  ReturnType<typeof getTweetsByUsername>
>[0];

