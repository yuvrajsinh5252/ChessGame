"use client";

import { useSearchParams } from "next/navigation";
import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import { useEffect, useState } from "react";
import { getPlayerColor } from "@/app/server";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function Page({ params }: PageProps) {
  const searchParams = useSearchParams();
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(
    null
  );

  const playerId = searchParams.get("playerId");
  const { roomId } = params;

  useEffect(() => {
    async function getColor() {
      if (playerId) {
        const color = await getPlayerColor(playerId);
        if (color === "white" || color === "black") setPlayerColor(color);
      }
    }

    getColor();
  }, []);

  if (playerColor === null) return <div>Loading...</div>;

  return (
    <div>
      <div>Room ID: {roomId}</div>
      <div>Player ID: {playerId}</div>
      <OnlineBoard player={playerColor} roomId={roomId} />
    </div>
  );
}
