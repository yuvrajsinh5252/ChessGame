"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFriends() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      status: "ACCEPTED",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
        },
      },
    },
  });

  return friendships.map((friendship) => {
    const friend =
      friendship.senderId === session.user?.id
        ? friendship.receiver
        : friendship.sender;
    return {
      id: friend.id,
      name: friend.name,
      image: friend.image,
      status: friend.status || "OFFLINE",
    };
  });
}

export async function handleFriendRequest(
  action: string,
  targetUserId: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          senderId: session.user.id,
          receiverId: targetUserId,
        },
        {
          senderId: targetUserId,
          receiverId: session.user.id,
        },
      ],
    },
  });

  switch (action) {
    case "add-friend":
      if (existingFriendship) {
        throw new Error("Already friends");
      }
      await prisma.friendship.create({
        data: {
          senderId: session.user.id,
          receiverId: targetUserId,
          status: "ACCEPTED",
        },
      });
      break;

    case "remove-friend":
      if (!existingFriendship) {
        throw new Error("Friendship does not exist");
      }
      await prisma.friendship.delete({
        where: { id: existingFriendship.id },
      });
      break;

    default:
      throw new Error("Invalid action");
  }

  revalidatePath("/profile/[userId]");
  revalidatePath("/");
}
