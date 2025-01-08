import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FriendRequestButton } from "@/Components/friends/FriendRequestButton";
import { QuickStats } from "@/Components/profile/quickStats";
import Link from "next/link";

export default async function UserProfile({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userStats: true,
    },
  });

  if (!user) {
    notFound();
  }

  const friendship = currentUserId
    ? await prisma.friendship.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
      })
    : null;

  const mutualFriends = currentUserId
    ? await prisma.friendship.findMany({
        where: {
          AND: [
            {
              OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
              status: "ACCEPTED",
            },
            {
              OR: [{ senderId: userId }, { receiverId: userId }],
              status: "ACCEPTED",
            },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
    : [];

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 py-8">
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute md:top-0 md:right-4 top-[-2rem] right-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3 md:p-4 text-white">
            <div className="text-xs md:text-sm">Rating</div>
            <div className="text-2xl md:text-3xl font-bold">
              {user.userStats?.rating || 1200}
            </div>
          </div>

          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User"}
            width={128}
            height={128}
            className="rounded-full"
          />

          <h1 className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">
            {user.name}
          </h1>

          {currentUserId && currentUserId !== userId && (
            <div className="mt-4">
              <FriendRequestButton
                targetUserId={userId}
                initialStatus={friendship?.status}
              />
            </div>
          )}
        </div>

        <QuickStats userProfile={user.userStats!} />

        {mutualFriends.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Mutual Friends</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mutualFriends.map((friendship) => {
                const friend =
                  friendship.sender.id === userId
                    ? friendship.receiver
                    : friendship.sender;
                return (
                  <Link
                    key={friend.id}
                    href={`/profile/${friend.id}`}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Image
                      src={friend.image || "/default-avatar.png"}
                      alt={friend.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium truncate">{friend.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
