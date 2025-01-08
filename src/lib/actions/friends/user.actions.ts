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

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
      NOT: {
        id: session.user.id,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      sentFriendships: {
        where: {
          receiverId: session.user.id,
        },
        select: {
          status: true,
        },
      },
      receivedFriendships: {
        where: {
          senderId: session.user.id,
        },
        select: {
          status: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    image: user.image,
    friendshipStatus:
      user.receivedFriendships[0]?.status ||
      user.sentFriendships[0]?.status ||
      null,
  }));
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      image: true,
    },
  });

  return user;
}
