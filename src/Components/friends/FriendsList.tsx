"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { UserMinus } from "lucide-react";
import {
  getFriends,
  handleFriendRequest,
} from "@/lib/actions/friends/friend.actions";

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  status?: "ONLINE" | "OFFLINE" | "IN_GAME";
}

export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsData = await getFriends();
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFriendAction = async (action: string, userId: string) => {
    setIsActionLoading(userId);
    try {
      await handleFriendRequest(action, userId);

      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error("Error handling friend request:", error);
    } finally {
      setIsActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, j) => (
          <div
            key={j}
            className="flex items-center justify-between p-3 py-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="space-y-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Friends</h3>
        <div className="space-y-2 overflow-y-scroll no-scrollbar max-h-44">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <Link
                href={`/profile/${friend.id}`}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <Image
                    src={friend.image || "/default-avatar.png"}
                    alt={friend.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${
                        friend.status === "ONLINE"
                          ? "bg-green-500"
                          : friend.status === "IN_GAME"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium truncate max-sm:max-w-[80px]">
                    {friend.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {friend.status === "ONLINE"
                      ? "Online"
                      : friend.status === "IN_GAME"
                      ? "In Game"
                      : "Offline"}
                  </span>
                </div>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleFriendAction("remove-friend", friend.id)}
                disabled={isActionLoading === friend.id}
              >
                {isActionLoading === friend.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <UserMinus className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
