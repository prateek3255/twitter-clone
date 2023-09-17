import { prisma } from "./db.server";
import { getUserSession } from "./auth.server";
import { json, redirect } from "@remix-run/node";

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
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
  request,
}: {
  userId: string;
  isFollowing: boolean;
  request: Request;
}) => {
  const currentUserId = await getUserSession(request);
  if (!currentUserId) {
    return redirect("/signin", 302);
  }
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
  return json({ success: true }, { status: 200 });
};

export const saveProfile = async (
  request: Request,
  { username, name, bio }: { username: string; bio: string; name: string }
) => {
  const loggedInUserId = await getUserSession(request);
  if (!loggedInUserId) {
    return redirect("/signin");
  }

  // Check if username is already taken
  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (existingUser && existingUser.id !== loggedInUserId) {
    return { success: false, error: "username_already_taken" };
  }

  // Update user
  await prisma.user.update({
    where: {
      id: loggedInUserId,
    },
    data: {
      username,
      name,
      bio,
    },
  });

  return { success: true, shouldRedirect: username !== existingUser?.username };
};
