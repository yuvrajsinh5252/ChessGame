import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MatchHistoryCard } from "@/Components/profile/match-history-card";
import { QuickStats } from "@/Components/profile/quickStats";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { AchievementsList } from "@/Components/profile/achievements";

async function getUserProfile(email: string, playerId: string) {
  const userStats = await prisma.userStats.findUnique({
    where: { userId: playerId },
  });

  if (!userStats) {
    await prisma.userStats.create({
      data: {
        userId: playerId,
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 1,
        winStreak: 0,
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userStats: true,
    },
  });

  if (!user) return null;
  return user;
}

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Not authenticated</p>
      </div>
    );
  }

  const userProfile = await getUserProfile(session.user.email, session.user.id);

  if (!userProfile) {
    return <div>User profile not found</div>;
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 py-8">
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute md:top-0 md:right-4 top-[-2rem] right-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3 md:p-4 text-white">
            <div className="text-xs md:text-sm">Rating</div>
            <div className="text-2xl md:text-3xl font-bold">
              {userProfile.userStats?.rating || 1200}
            </div>
          </div>
          <Image
            src={userProfile.image!}
            alt="User Avatar"
            width={128}
            height={128}
            className="rounded-full"
          />

          <h1 className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">
            {userProfile.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {userProfile.email}
          </p>
        </div>

        <QuickStats userProfile={userProfile.userStats!} />
        <div className="flex gap-8 flex-col">
          <MatchHistoryCard userProfile={userProfile.userStats!} />

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements
            </h2>
            <AchievementsList userProfile={userProfile.userStats!} />
          </div>
        </div>
      </div>
    </div>
  );
}
