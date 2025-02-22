"use client";

import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import MaxWidthWrapper from "@/Components/common/MaxWidthWrapper";
import { Black } from "@/Components/online-mode/black";
import { White } from "@/Components/online-mode/white";
import { useEffect, useState } from "react";
import {
  getOpponentPlayerName,
  getPlayerColor,
} from "@/lib/actions/game/helper";
import { Loader2 } from "lucide-react";
import { Winner } from "@/Components/online-mode/winner";
import { Promote } from "@/Components/online-mode/promote";
import { GameControl } from "@/Components/online-mode/gameControl";
import { DrawRequest } from "@/Components/online-mode/drawRequest";
import { Suspense } from "react";
import useChatStore from "@/store/useChatStore";
import ChatSidebar from "@/Components/online-mode/chat/chatBar";
import { useSession } from "next-auth/react";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

function PageContent({ params }: PageProps) {
  const { isOpen: chatBoxOpen } = useChatStore((state) => state);
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponentName, setOpponentName] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const playerId = session?.user?.id;
  const playerName = session?.user?.name;

  useEffect(() => {
    async function fetchRoomId() {
      const { roomId } = await params;
      setRoomId(roomId);
    }

    fetchRoomId();
  }, [params]);

  useEffect(() => {
    if (!playerId || !roomId) return;

    const fetchPlayerColor = async () => {
      let playerColor = await getPlayerColor(playerId);
      setColor(playerColor);
    };

    const fetchOpponentPlayerName = async () => {
      let opponentPlayerName = await getOpponentPlayerName(roomId, playerId);
      setOpponentName(opponentPlayerName);
    };

    fetchPlayerColor();
    fetchOpponentPlayerName();
  }, [playerId, roomId]);

  if (status === "loading") return null;

  if (!color || !playerId || !roomId || !playerName)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4" size={50} strokeWidth={3} />
        <p className="text-gray-600 text-lg font-medium">
          Connecting to game...
        </p>
      </div>
    );

  return (
    <MaxWidthWrapper>
      <div
        className={`flex flex-col gap-2 justify-center items-center transition-all duration-500 ${
          chatBoxOpen ? "blur-0" : "max-sm:blur-sm"
        }`}
      >
        <div className="flex gap-2 flex-col justify-center items-center pt-10 min-h-screen max-sm:pb-10">
          <Promote playerColor={color} roomId={roomId} />
          <Winner />
          <DrawRequest roomId={roomId} playerId={playerId} />
          {color === "white" ? (
            <>
              <Black playerName={opponentName!} />
              <OnlineBoard roomId={roomId} playerId={playerId!} />
              <White playerName={playerName} />
            </>
          ) : (
            <>
              <White playerName={opponentName!} />
              <OnlineBoard roomId={roomId} playerId={playerId!} />
              <Black playerName={playerName} />
            </>
          )}
          <ChatSidebar
            roomId={roomId}
            playerId={playerId}
            playerName={playerName}
          />
          <GameControl roomId={roomId} playerId={playerId} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default function PageWrapper({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col items-center justify-center">
          <Loader2 className="animate-spin mb-4" size={50} strokeWidth={3} />
          <p className="text-gray-600 text-lg font-medium">Loading game...</p>
        </div>
      }
    >
      <PageContent params={params} />
    </Suspense>
  );
}
