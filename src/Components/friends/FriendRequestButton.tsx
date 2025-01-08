"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { UserPlus, UserMinus, Clock } from "lucide-react";
import { handleFriendRequest } from "@/lib/actions/friends/friend.actions";

export function FriendRequestButton({
  targetUserId,
  initialStatus,
}: {
  targetUserId: string;
  initialStatus?: "PENDING" | "ACCEPTED" | "DECLINED" | null;
}) {
  const [status, setStatus] = useState(initialStatus);

  const handleRequest = async () => {
    try {
      await handleFriendRequest(
        status === "ACCEPTED" ? "remove-friend" : "send-request",
        targetUserId
      );
      setStatus(status === "ACCEPTED" ? null : "PENDING");
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  if (status === "PENDING") {
    return (
      <Button disabled>
        <Clock className="w-4 h-4 mr-2" />
        Request Pending
      </Button>
    );
  }

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
