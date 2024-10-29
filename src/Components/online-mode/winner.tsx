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
import { useEffect, useState } from "react";
import JSConfetti from "js-confetti";

export const Winner = () => {
  const { gameState, players } = useOnlineChessStore((state) => state);
  const winner = gameState?.winner;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && winner !== "none") {
      setIsClient(true);
      setTimeout(() => {
        const confetti = new JSConfetti();
        confetti.addConfetti({
          confettiColors: [
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4caf50",
            "#8bc34a",
            "#cddc39",
            "#ffeb3b",
            "#ffc107",
            "#ff9800",
            "#ff5722",
            "#795548",
            "#607d8b",
          ],
          confettiRadius: 10,
          confettiNumber: 20,
        });
      }, 1000);
    }
  }, [winner]);

  if (!isClient) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="w-full max-w-md p-5 rounded-lg mx-auto">
        <DialogHeader>
          <DialogTitle>
            <span className="text-2xl font-semibold text-center block">
              Game Over
            </span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-lg font-semibold block">
            {gameState?.status === "resigned"
              ? `${winner === "black" ? "White" : "Black"} wins by resignation`
              : winner === "black"
              ? "White wins"
              : winner === "draw"
              ? "Draw"
              : "Black wins"}{" "}
          </DialogDescription>
          <div className="text-center mt-2">
            <span className="text-lg font-medium">
              Score:{" "}
              {winner === "draw"
                ? "1/2 - 1/2"
                : winner === "black"
                ? "0 - 1"
                : "1 - 0"}
            </span>
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => {
                if (players[0].gameId) deleteGame(players[0].gameId);
                window.location.href = "/";
              }}
              className="px-4 py-2"
            >
              Back to Home
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
