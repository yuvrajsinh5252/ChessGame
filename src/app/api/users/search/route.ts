import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter required" },
        { status: 400 }
      );
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

    return NextResponse.json(usersWithFriendStatus);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
