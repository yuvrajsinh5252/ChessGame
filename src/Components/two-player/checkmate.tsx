"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useChessStore } from "@/store/useChessStore";
import JSConfetti from "js-confetti";
import { useEffect, useState } from "react";

export const CheckMate = () => {
  const { isCheckMate } = useChessStore((state) => state);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && isCheckMate !== "noCheckMate") {
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
  }, [isCheckMate]);

  if (!isClient) return null;

  return (
    <div>
      <Dialog open={true}>
        <DialogContent className="w-full max-w-md p-5 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>
              <span className="text-2xl font-semibold text-center">
                Game Over
              </span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg font-semibold">
              {isCheckMate === "black"
                ? "White"
                : isCheckMate === "draw"
                ? "It's a Draw"
                : isCheckMate === "stalemate"
                ? "Stalemate"
                : "Black"}{" "}
              wins!
            </DialogDescription>
            <div className="text-center text-lg font-semibold">
              {isCheckMate === "draw" || isCheckMate === "stalemate"
                ? "1/2 - 1/2"
                : isCheckMate === "white"
                ? "0 - 1"
                : "1 - 0"}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => {
                  localStorage.removeItem("chess-store");
                  window.location.href = "/";
                }}
              >
                Back to Home
              </button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
