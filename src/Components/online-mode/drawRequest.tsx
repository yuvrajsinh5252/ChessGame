"use client";

import { Button } from "../ui/button";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { drawAccepted, drawDeclined } from "@/lib/db/draw";

export function DrawRequest({
  roomId,
  playerId,
}: {
  roomId: string;
  playerId: string;
}) {
  const { players, updatePlayersState } = useOnlineChessStore((state) => state);

  const res = players ? players.find((player) => player.id === playerId) : null;

  if (!res || res.drawRequest !== true) return null;
  return (
    <Dialog open={true}>
      <DialogContent className="w-fit p-5 rounded-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="text-2xl flex justify-center items-center font-semibold text-center">
              Draw Request
            </span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-lg font-semibold">
            {res.color === "white" ? "black" : "white"} has requested a draw
          </DialogDescription>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => {
                drawAccepted(roomId);
                updatePlayersState(
                  players.map((player) => ({
                    ...player,
                    drawRequest: false,
                  }))
                );
              }}
              variant={"destructive"}
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                drawDeclined(roomId);
                updatePlayersState(
                  players.map((player) => ({
                    ...player,
                    drawRequest: false,
                  }))
                );
              }}
            >
              Decline
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
