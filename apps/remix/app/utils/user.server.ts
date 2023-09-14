import { prisma } from "./db.server";
import { getUserSession } from "./auth.server";

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    // TODO: Handle error boundaries
    throw new Error("User not found");
  }

  return user;
};

export const getCurrentLoggedInUser = async (request: Request) => {
  const userId = await getUserSession(request);
  if (userId) {
    const user = await getUser(userId);
    return user;
  }
  return null;
};

export const getUserProfile = async (username: string, request: Request) => {
  const currentLoggedInUserId = await getUserSession(request);
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          tweets: true,
        },
      },
      ...(typeof currentLoggedInUserId === "string"
        ? {
            followers: {
              select: {
                id: true,
              },
              where: {
                id: currentLoggedInUserId,
              },
            },
          }
        : {}),
    },
  });
  return user;
};

export const toggleFollowUser = async ({
  userId,
  isFollowing,
  request
}: {
  userId: string;
  isFollowing: boolean;
  request: Request;
}) => {
  const currentUserId = await getUserSession(request);
  // if (!currentUserId) {
  //   redirect("/signin");
  // }
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
};
