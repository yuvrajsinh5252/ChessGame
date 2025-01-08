"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { handleFriendRequest } from "@/lib/actions/friends/friend.actions";

export function FriendRequestButton({
  targetUserId,
  initialStatus,
}: {
  targetUserId: string;
  initialStatus?: "PENDING" | "ACCEPTED" | null;
}) {
  const [status, setStatus] = useState(initialStatus);

  const handleRequest = async () => {
    try {
      await handleFriendRequest(
        status === "ACCEPTED" ? "remove-friend" : "add-friend",
        targetUserId
      );
      setStatus(status === "ACCEPTED" ? null : "PENDING");
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  return (
    <Button onClick={handleRequest}>
      {status === "ACCEPTED" ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Remove Friend
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </>
      )}
    </Button>
  );
}
