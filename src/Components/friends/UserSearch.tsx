"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface UserSearchResult {
  id: string;
  name: string;
  image: string;
  isFriend: boolean;
}

const DEFAULT_AVATAR = "/default-avatar.png";

export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
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
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      ) : (
        searchResults.length > 0 && (
          <div className="space-y-2">
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
                    src={user.image || DEFAULT_AVATAR}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium">{user.name}</span>
                </Link>
                {!user.isFriend && (
                  <Button size="sm" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
