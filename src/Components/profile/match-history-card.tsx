"use client";

import { Trophy, MinusCircle, XCircle, Calendar } from "lucide-react";
import { gameHistory } from "@prisma/client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/actions/friends/user.actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function MatchHistoryCard({
  matchHistory,
}: {
  matchHistory: gameHistory[];
}) {
  const [opponentNames, setOpponentNames] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchOpponentNames = async () => {
      const names: { [key: string]: string } = {};
      for (const match of matchHistory) {
        try {
          const response = await getUser(match.opponentId);
          names[match.opponentId] = response?.name || `Unknown Player`;
        } catch (error) {
          console.error("Error fetching opponent name:", error);
          names[match.opponentId] = `Unknown Player`;
        }
      }
      setOpponentNames(names);
    };

    fetchOpponentNames();
  }, [matchHistory]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Match History
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {matchHistory.length} matches played
        </span>
      </div>

      <div className="space-y-3">
        {matchHistory.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No matches played yet
            </p>
          </div>
        ) : (
          matchHistory.map((match) => (
            <Link
              href={`/profile/${match.opponentId}`}
              key={match.id}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-8 rounded-full ${
                      match.result === match.playerColor
                        ? "bg-green-500"
                        : match.result !== "draw"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium dark:text-gray-200">
                        vs {opponentNames[match.opponentId] || `Loading...`}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          match.result === match.playerColor
                            ? "bg-green-500"
                            : match.result !== "draw"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {match.result.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>Played as {match.playerColor}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(match.createdAt))} ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {match.result === "win" && (
                    <Trophy className="w-5 h-5 text-green-500" />
                  )}
                  {match.result === "loss" && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  {match.result === "draw" && (
                    <MinusCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
