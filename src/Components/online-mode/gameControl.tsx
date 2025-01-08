import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import { handlePlayerResign } from "@/lib/actions/game/helper";
import { handlePlayerDraw } from "@/lib/actions/game/draw";

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
        onClick={async () => {
          if (window.confirm("Are you sure you want to resign?")) {
            await handlePlayerResign(roomId, playerId);
            window.location.href = "/";
          }
        }}
      >
        Resign
      </Button>
      <Button
        variant={"destructive"}
        onClick={async () => {
          if (window.confirm("Are you sure you want to leave the game?")) {
            await handlePlayerResign(roomId, playerId);
            window.location.href = "/";
          }
        }}
      >
        Leave Game
      </Button>
      <Button
        disabled={drawRequest}
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
