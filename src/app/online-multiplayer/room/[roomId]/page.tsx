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

  if (!playerId || !roomId) return <div>Invalid URL</div>;

  useEffect(() => {
    const fetchPlayerColor = async () => {
      let playerColor = await getPlayerColor(playerId);
      setColor(playerColor);
    };

    fetchPlayerColor();
  }, [playerId]);

  if (!color)
    return (
      <div className="h-[calc(100vh-6rem)] animate-spin flex justify-center items-center">
        <Loader2 size={50} />
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
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
