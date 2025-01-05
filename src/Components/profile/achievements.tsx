import { UserStats } from "@prisma/client";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  {
    id: "first_win",
    name: "First Victory",
    description: "Win your first chess game",
    icon: "🏆",
    tier: "bronze",
    unlocked: false,
  },
  {
    id: "checkmate_master",
    name: "Checkmate Master",
    description: "Win 10 games by checkmate",
    icon: "👑",
    tier: "silver",
    unlocked: false,
  },
  {
    id: "grandmaster",
    name: "Grandmaster",
    description: "Achieve 2000+ rating",
    icon: "🌟",
    tier: "platinum",
    unlocked: false,
  },
  {
    id: "streak_master",
    name: "Winning Streak",
    description: "Win 5 games in a row",
    icon: "🔥",
    tier: "gold",
    unlocked: false,
  },
];

export function AchievementsList({ userProfile }: { userProfile: UserStats }) {
  const getTierColor = (tier: Achievement["tier"]) => {
    switch (tier) {
      case "bronze":
        return "from-amber-700 to-amber-500";
      case "silver":
        return "from-gray-400 to-gray-300";
      case "gold":
        return "from-yellow-500 to-yellow-300";
      case "platinum":
        return "from-cyan-400 to-blue-500";
    }
  };

  const unlockedAchievements = achievements.map((achievement) => ({
    ...achievement,
    unlocked:
      (achievement.id === "first_win" && userProfile.wins > 0) ||
      (achievement.id === "checkmate_master" && userProfile.wins >= 10) ||
      (achievement.id === "grandmaster" && userProfile.rating >= 2000) ||
      (achievement.id === "streak_master" && userProfile.winStreak >= 5),
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
      {unlockedAchievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`relative overflow-hidden rounded-xl backdrop-blur-sm ${
            achievement.unlocked
              ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50"
              : "bg-gray-900/40 border-gray-800/40"
          } border p-4 sm:p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-gray-900/20 group`}
        >
          <div className="flex items-center gap-3 sm:gap-5">
            <div
              className={`flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-gradient-to-br ${
                achievement.unlocked
                  ? getTierColor(achievement.tier)
                  : "from-gray-800 to-gray-700"
              } text-2xl sm:text-3xl shadow-lg transform transition-transform duration-300 group-hover:scale-110`}
            >
              {achievement.icon}
            </div>
            <div className="flex-1 space-y-1 sm:space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <h3 className="font-bold text-base sm:text-lg text-white/90">
                  {achievement.name}
                </h3>
                <span
                  className={`text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${
                    achievement.unlocked
                      ? "bg-green-500/20 text-green-400 border border-green-500/20"
                      : "bg-gray-700/50 text-gray-200 border border-gray-700/30"
                  }`}
                >
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 font-medium">
                {achievement.description}
              </p>
              <div>
                <span
                  className={`text-xs text-white uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-full
            ${
              achievement.unlocked
                ? `bg-gradient-to-r ${getTierColor(achievement.tier)} shadow-sm`
                : "bg-gray-600"
            }
            font-semibold`}
                >
                  {achievement.tier}
                </span>
              </div>
            </div>
          </div>
          {achievement.unlocked && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
              <span className="text-green-400 text-xl sm:text-2xl">✓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
