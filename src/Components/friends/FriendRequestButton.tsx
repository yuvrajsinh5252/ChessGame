"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { UserPlus, UserMinus, Clock } from "lucide-react";

export function FriendRequestButton({
  targetUserId,
  initialStatus,
}: {
  targetUserId: string;
  initialStatus?: "PENDING" | "ACCEPTED" | "DECLINED" | null;
}) {
  const [status, setStatus] = useState(initialStatus);

  const handleFriendRequest = async () => {
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: status === "ACCEPTED" ? "remove-friend" : "send-request",
          targetUserId,
        }),
      });

      if (res.ok) {
        setStatus(status === "ACCEPTED" ? null : "PENDING");
      }
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
    <Button onClick={handleFriendRequest}>
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
