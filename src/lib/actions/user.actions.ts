"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function searchUsers(query: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!query) {
    throw new Error("Query parameter required");
  }

  // Find users matching the search query
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
      NOT: {
        id: session.user.id, // Exclude current user
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: 10, // Limit results
  });

  // Check if each user is already a friend
  const usersWithFriendStatus = await Promise.all(
    users.map(async (user) => {
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              senderId: session.user?.id,
              receiverId: user.id,
            },
            {
              senderId: user.id,
              receiverId: session.user?.id,
            },
          ],
        },
      });

      return {
        ...user,
        isFriend: !!friendship && friendship.status === "ACCEPTED",
      };
    })
  );

  return usersWithFriendStatus;
}
