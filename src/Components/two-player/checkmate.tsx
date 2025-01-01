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
        <DialogContent className="w-full max-w-md p-6 rounded-xl shadow-2xl ">
          <DialogHeader className="space-y-4">
            <DialogTitle>
              <span className="text-4xl font-bold text-center block bg-clip-text">
                Game Over
              </span>
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <div
                className={`text-2xl font-bold ${
                  isCheckMate === "draw" || isCheckMate === "stalemate"
                    ? "text-gray-600"
                    : isCheckMate === "black"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {isCheckMate === "black"
                  ? "White"
                  : isCheckMate === "draw"
                  ? "It's a Draw!"
                  : isCheckMate === "stalemate"
                  ? "Stalemate!"
                  : "Black"}{" "}
                {isCheckMate !== "draw" &&
                  isCheckMate !== "stalemate" &&
                  "Wins!"}
              </div>
              <div className="text-3xl font-mono font-bold tracking-wider">
                {isCheckMate === "draw" || isCheckMate === "stalemate"
                  ? "½ - ½"
                  : isCheckMate === "white"
                  ? "0 - 1"
                  : "1 - 0"}
              </div>
            </DialogDescription>
            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-lg
                          hover:from-blue-600 hover:to-purple-600 transition-all duration-300 ease-in-out
                          transform hover:scale-105 hover:shadow-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
