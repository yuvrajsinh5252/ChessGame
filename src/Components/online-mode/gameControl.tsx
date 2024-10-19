import { handlePlayerDraw, handlePlayerResign } from "@/app/server";
import { Button } from "../ui/button";

export function GameControl({
  playerId,
  roomId,
}: {
  playerId: string;
  roomId: string;
}) {
  return (
    <div className="absolute bottom-5 flex gap-2">
      <Button
        onClick={() => {
          if (window.confirm("Are you sure you want to resign?")) {
            handlePlayerResign(roomId, playerId);
          }
        }}
      >
        Resign
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          handlePlayerResign(roomId, playerId);
          window.location.href = "/";
        }}
      >
        Leave Game
      </Button>
      <Button
        onClick={() => {
          handlePlayerDraw(roomId, playerId);
        }}
      >
        Draw
      </Button>
    </div>
  );
}
