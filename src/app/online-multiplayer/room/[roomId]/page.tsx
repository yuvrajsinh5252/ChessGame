"use client";

import { useSearchParams } from "next/navigation";
import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { Black } from "@/Components/online-mode/black";
import { White } from "@/Components/online-mode/white";
import { useEffect, useState } from "react";
import { getPlayerColor } from "@/app/server";
import { Loader2 } from "lucide-react";
import { Winner } from "@/Components/online-mode/winner";
import { Promote } from "@/Components/online-mode/promote";
import { GameControl } from "@/Components/online-mode/gameControl";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function Page({ params }: PageProps) {
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const searchParams = useSearchParams();

  const playerId = searchParams.get("playerId");
  const { roomId } = params;

  useEffect(() => {
    if (!playerId || !roomId) return;

    const fetchPlayerColor = async () => {
      let playerColor = await getPlayerColor(playerId);
      setColor(playerColor);
    };

    fetchPlayerColor();
  }, [playerId, roomId]);

  if (!playerId || !roomId) return <div>Invalid URL</div>;

  if (!color)
    return (
      <div className="relative">
        <Loader2
          className="absolute animate-spin left-1/2 right-1/2 h-screen"
          size={50}
        />
      </div>
    );

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 max-sm:pt-20 min-h-screen">
          <Promote playerColor={color} roomId={roomId} />
          <Winner />
          {color === "white" ? (
            <>
              <Black />
              <OnlineBoard roomId={roomId} playerId={playerId!} />
              <White />
            </>
          ) : (
            <>
              <White />
              <OnlineBoard roomId={roomId} playerId={playerId!} />
              <Black />
            </>
          )}
          <GameControl roomId={roomId} playerId={playerId} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
