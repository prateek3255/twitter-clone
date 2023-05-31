import { cache } from "react";
import { prisma } from "./db";

export const getUser = cache(async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if(!user) {
    throw new Error("User not found");
  }

  return user;
});
