"use client";

import { drawAccepted, drawDeclined } from "@/app/server";
import { Button } from "../ui/button";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

export function DrawRequest({
  roomId,
  playerId,
}: {
  roomId: string;
  playerId: string;
}) {
  const { players } = useOnlineChessStore((state) => state);

  const res = players.find((player) => player.id === playerId);
  if (!res || res.drawRequest !== true) return null;
  return (
    <Dialog open={true}>
      <DialogContent className="w-fit p-5 rounded-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="text-2xl font-semibold text-center">
              Draw Request
            </span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-lg font-semibold">
            {res.name} has requested a draw
          </DialogDescription>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => {
                drawAccepted(roomId);
              }}
              variant={"destructive"}
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                drawDeclined(roomId);
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
