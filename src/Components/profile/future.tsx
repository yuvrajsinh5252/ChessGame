export function Future() {
  return (
    <>
      {/* Playing Style Card */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Sword className="w-5 h-5 mr-2 text-red-500" />
          Playing Style
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Aggressive Moves
            </span>
            <div className="w-48 bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Defensive Plays
            </span>
            <div className="w-48 bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Detailed Stats Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Average Game Duration
              </span>
              <span className="font-semibold">
                {userProfile.userStats?.averageGameDuration || "15:00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Fastest Win
              </span>
              <span className="font-semibold">
                {userProfile.userStats?.fastestWin || "5:30"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Longest Game
              </span>
              <span className="font-semibold">
                {userProfile.userStats?.longestGame || "45:20"}
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
