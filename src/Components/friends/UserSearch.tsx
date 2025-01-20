"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchUsers } from "@/lib/actions/friends/user.actions";
import { handleFriendRequest } from "@/lib/actions/friends/friend.actions";

interface UserSearchResult {
  id: string;
  name: string | null;
  image: string | null;
  isFriend: boolean;
}

export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(
        results.map((user) => ({
          ...user,
          isFriend: user.friendshipStatus === "ACCEPTED",
        }))
      );
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    setIsActionLoading(userId);
    try {
      await handleFriendRequest("add-friend", userId);
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFriend: true } : user
        )
      );
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setIsActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={isLoading}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3"></div>
            </div>
          ))}
        </div>
      ) : (
        searchResults.length > 0 && (
          <div className="space-y-2 overflow-y-scroll no-scrollbar max-h-44 ">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center space-x-3"
                >
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium truncate max-sm:max-w-[80px]">
                    {user.name}
                  </span>
                </Link>
                {!user.isFriend ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFriend(user.id)}
                    disabled={isActionLoading === user.id}
                  >
                    {isActionLoading === user.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2 max-sm:mr-0" />
                        <span className="max-sm:hidden">Add Friend</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <span className="text-sm text-gray-500">Friends</span>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
