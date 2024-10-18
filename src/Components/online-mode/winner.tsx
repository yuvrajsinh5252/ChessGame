"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import useOnlineChessStore from "@/store/useOnlineChessStore";

export const Winner = () => {
  const { gameState } = useOnlineChessStore((state) => state);
  const winner = gameState?.winner;

  if (winner !== "none") {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Winner</DialogTitle>
            <DialogDescription>
              {winner === "black"
                ? "white"
                : winner === "draw"
                ? "draw"
                : "black"}{" "}
              wins!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
};
