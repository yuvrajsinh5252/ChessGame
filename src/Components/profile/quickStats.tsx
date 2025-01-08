import { UserStats } from "@prisma/client";
import { Activity, Target, Trophy } from "lucide-react";
import { FaChessKnight } from "react-icons/fa";

export async function QuickStats({ userProfile }: { userProfile: UserStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <FaChessKnight className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Games Played</h3>
        </div>
        <p className="text-3xl font-bold text-gray-800 dark:text-white max-sm:text-center">
          {userProfile?.gamesPlayed || 0}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">Wins</h3>
        </div>
        <p className="text-3xl font-bold text-gray-800 dark:text-white max-sm:text-center">
          {userProfile?.wins || 0}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">Losses</h3>
        </div>
        <p className="text-3xl font-bold text-gray-800 dark:text-white max-sm:text-center">
          {userProfile?.losses || 0}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold">Win Rate</h3>
        </div>
        <p className="text-3xl font-bold text-gray-800 dark:text-white max-sm:text-center">
          {userProfile
            ? ((userProfile.wins / userProfile.gamesPlayed) * 100).toFixed(1) +
              "%"
            : "0%"}
        </p>
      </div>
    </div>
  );
}
