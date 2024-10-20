import { handlePlayerDraw, handlePlayerResign } from "@/app/server";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import useOnlineChessStore from "@/store/useOnlineChessStore";

export function GameControl({
  playerId,
  roomId,
}: {
  playerId: string;
  roomId: string;
}) {
  const { players } = useOnlineChessStore((state) => state);
  const [drawRequest, setDrawRequest] = useState(false);

  useEffect(() => {
    if (!players[0]?.drawRequest && !players[1]?.drawRequest) {
      setDrawRequest(false);
    }
  }, [players]);

  return (
    <div className="absolute bottom-5 flex gap-2">
      <Button
        onClick={() => {
          if (window.confirm("Are you sure you want to resign?")) {
            handlePlayerResign(roomId, playerId);
            window.location.href = "/";
          }
        }}
      >
        Resign
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          if (window.confirm("Are you sure you want to leave the game?")) {
            handlePlayerResign(roomId, playerId);
            window.location.href = "/";
          }
        }}
      >
        Leave Game
      </Button>
      <Button
        onClick={() => {
          setDrawRequest(true);
          handlePlayerDraw(roomId, playerId);
        }}
      >
        {drawRequest ? "Request Sent" : "Draw"}
      </Button>
    </div>
  );
}
