import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, targetUserId } = await req.json();

    switch (action) {
      case "send-request":
        const newRequest = await prisma.friendship.create({
          data: {
            senderId: session.user.id,
            receiverId: targetUserId,
          },
        });
        return NextResponse.json(newRequest);

      case "accept-request":
        const acceptedRequest = await prisma.friendship.update({
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
        return NextResponse.json(acceptedRequest);

      case "decline-request":
        const declinedRequest = await prisma.friendship.update({
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
        return NextResponse.json(declinedRequest);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "friends":
        const friends = await prisma.friendship.findMany({
          where: {
            OR: [
              { senderId: session.user.id },
              { receiverId: session.user.id },
            ],
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
        return NextResponse.json(friends);

      case "pending":
        const pendingRequests = await prisma.friendship.findMany({
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
        return NextResponse.json(pendingRequests);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
