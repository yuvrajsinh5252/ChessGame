import { UserStats } from "@prisma/client";
import { Clock } from "lucide-react";

export function MatchHistoryCard({ userProfile }: { userProfile: UserStats }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-green-500" />
        Recent Performance
      </h2>
      <div className="flex space-x-2 mb-4">
        {[...Array(Math.min(20, userProfile.gamesPlayed))].map((_, i) => {
          const gameResult =
            i < userProfile.gamesPlayed % 10
              ? i < userProfile.wins % 10
                ? "win"
                : i < (userProfile.wins + userProfile.draws) % 10
                ? "draw"
                : "loss"
              : "none";

          return (
            <div
              key={i}
              className={`h-2 w-full rounded-full ${
                gameResult === "win"
                  ? "bg-green-500"
                  : gameResult === "draw"
                  ? "bg-yellow-500"
                  : gameResult === "loss"
                  ? "bg-red-500"
                  : "bg-gray-300"
              }`}
            />
          );
        })}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {userProfile.gamesPlayed} games played
      </div>
    </div>
  );
}
