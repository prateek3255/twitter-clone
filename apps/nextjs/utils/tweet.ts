import { prisma } from "./db";
import { getUserId } from "./auth";
import "server-only";

export const getTweetsByUsername = async (
  username: string,
  cursor?: string
) => {
  const userId = getUserId();
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

export const getTweetWithID = async (id: string) => {
  const userId = getUserId();

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
  });

  return tweet;
};

export const getTweetReplies = async (id: string, cursor?: string) => {
  const userId = getUserId();

  const tweets = await prisma.tweet.findMany({
    where: {
      replyToId: id,
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
    take: 4,
    skip: typeof cursor === "string" ? 1 : 0,
    cursor:
      typeof cursor === "string"
        ? {
            id: cursor,
          }
        : undefined,
    orderBy: {
      createdAt: "asc",
    },
  });

  return tweets;
};

export type UserTweetsWithMeta = Awaited<
  ReturnType<typeof getTweetsByUsername>
>[0];

export type TweetWithMeta = NonNullable<
  Awaited<ReturnType<typeof getTweetWithID>>
>;

export type TweetRepliesWithMeta = Awaited<
  ReturnType<typeof getTweetReplies>
>[0];
