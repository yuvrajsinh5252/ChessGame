"use client";

import { useSearchParams } from "next/navigation";
import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import MaxWidthWrapper from "@/Components/MaxWidthWrapper";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function Page({ params }: PageProps) {
  const searchParams = useSearchParams();

  const playerId = searchParams.get("playerId");
  const { roomId } = params;

  if (!playerId || !roomId) return <div>Invalid URL</div>;

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex gap-2 flex-col justify-center items-center pt-10 max-sm:pt-20 min-h-screen">
          <div>Room ID: {roomId}</div>
          <div>Player ID: {playerId}</div>
          <OnlineBoard roomId={roomId} playerId={playerId!} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
