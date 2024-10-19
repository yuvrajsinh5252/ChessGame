"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import { Button } from "../ui/button";
import { deleteGame } from "@/app/server";

export const Winner = () => {
  const { gameState, players } = useOnlineChessStore((state) => state);
  const winner = gameState?.winner;

  if (winner !== "none") {
    return (
      <Dialog open={true}>
        <DialogContent className="w-fit p-5 rounded-lg">
          <DialogHeader>
            <DialogTitle>
              <span className="text-2xl font-semibold text-center">
                Game Over
              </span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg font-semibold">
              {gameState?.status === "resigned"
                ? `${
                    winner === "black" ? "White" : "Black"
                  } wins by resignation`
                : winner === "black"
                ? "White win's"
                : winner === "draw"
                ? "Draw"
                : "Black win's"}{" "}
            </DialogDescription>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => {
                  if (players[0].gameId) deleteGame(players[0].gameId);
                  window.location.href = "/";
                }}
              >
                Back to Home
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
};
