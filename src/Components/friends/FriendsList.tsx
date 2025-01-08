"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { UserMinus, Check, X } from "lucide-react";
import {
  getFriends,
  getPendingRequests,
  handleFriendRequest,
} from "@/lib/actions/friends/friend.actions";

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  status?: "ONLINE" | "OFFLINE" | "IN_GAME";
}

interface FriendRequest {
  id: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

const DEFAULT_AVATAR = "/default-avatar.png";

export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsData, requestsData] = await Promise.all([
          getFriends(),
          getPendingRequests(),
        ]);
        setFriends(friendsData);
        setPendingRequests(
          requestsData.map((request) => ({
            id: request.sender.id,
            name: request.sender.name,
            image: request.sender.image,
          }))
        );
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

      // Refresh the lists
      const [friendsData, requestsData] = await Promise.all([
        getFriends(),
        getPendingRequests(),
      ]);
      setFriends(friendsData);
      setPendingRequests(
        requestsData.map((request) => ({
          id: request.sender.id,
          name: request.sender.name,
          image: request.sender.image,
        }))
      );
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
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Friend Requests</h3>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={request.image || DEFAULT_AVATAR}
                    alt={request.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium">
                    {request.name || "Unknown User"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleFriendAction("accept-request", request.id)
                    }
                    disabled={isActionLoading === request.id}
                  >
                    {isActionLoading === request.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleFriendAction("decline-request", request.id)
                    }
                    disabled={isActionLoading === request.id}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Friends</h3>
        <div className="space-y-2">
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
                    src={friend.image || DEFAULT_AVATAR}
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
                  <span className="font-medium">{friend.name}</span>
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
