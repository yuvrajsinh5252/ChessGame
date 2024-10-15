"use client";

import { useSearchParams } from "next/navigation";
import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import { useEffect, useState } from "react";
import { getPlayerColor } from "@/app/server";
import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { BlackPlayer } from "@/Components/blackPlayer";
import { WhitePlayer } from "@/Components/whitePlayer";

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
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 max-sm:pt-20 min-h-screen">
          <div>Room ID: {roomId}</div>
          <div>Player ID: {playerId}</div>
          {playerColor === "black" ? (
            <>
              <WhitePlayer />
              <OnlineBoard player={playerColor} roomId={roomId} />
              <BlackPlayer />
            </>
          ) : (
            <>
              <BlackPlayer />
              <OnlineBoard player={playerColor} roomId={roomId} />
              <WhitePlayer />
            </>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
