import { cache } from "react";
import { prisma } from "./db";
import { getUserId, isAuthenticated } from "./auth";
import "server-only";

export const getUser = cache(async (userId: number) => {
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
  const isLoggedIn = isAuthenticated();
  if (isLoggedIn) {
    const userId = getUserId();
    const user = await getUser(userId);
    return user;
  }
  return null;
};
