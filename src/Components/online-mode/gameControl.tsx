import { handlePlayerResign } from "@/app/server";
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
          handlePlayerResign(roomId, playerId);
        }}
      >
        Resign
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Leave Game
      </Button>
      <Button onClick={() => {}}>Draw</Button>
    </div>
  );
}
