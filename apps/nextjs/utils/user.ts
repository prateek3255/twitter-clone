import { cache } from "react";
import { prisma } from "./db";
import { getUserId } from "./auth";
import "server-only";

export const getUser = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
});

export const getCurrentLoggedInUser = async () => {
  const userId = getUserId();
  if (userId) {
    const user = await getUser(userId);
    return user;
  }
  return null;
};

export const getUserProfile = cache(async (username: string) => {
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
    },
  });
  return user;
});
