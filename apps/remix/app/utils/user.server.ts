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