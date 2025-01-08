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

export async function getPendingRequests() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const requests = await prisma.friendship.findMany({
    where: {
      receiverId: session.user.id,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return requests.map((request) => ({
    id: request.id,
    sender: {
      id: request.sender.id,
      name: request.sender.name,
      image: request.sender.image,
    },
  }));
}

export async function handleFriendRequest(
  action: string,
  targetUserId: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  switch (action) {
    case "send-request":
      await prisma.friendship.create({
        data: {
          senderId: session.user.id,
          receiverId: targetUserId,
        },
      });
      break;

    case "accept-request":
      await prisma.friendship.update({
        where: {
          senderId_receiverId: {
            senderId: targetUserId,
            receiverId: session.user.id,
          },
        },
        data: {
          status: "ACCEPTED",
        },
      });
      break;

    case "decline-request":
      await prisma.friendship.update({
        where: {
          senderId_receiverId: {
            senderId: targetUserId,
            receiverId: session.user.id,
          },
        },
        data: {
          status: "DECLINED",
        },
      });
      break;

    case "remove-friend":
      await prisma.friendship.deleteMany({
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
      break;

    default:
      throw new Error("Invalid action");
  }

  revalidatePath("/profile/[userId]");
  revalidatePath("/");
}
