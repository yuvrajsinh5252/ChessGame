"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useChessStore } from "@/store/useChessStore";
import useOnlineChessStore from "@/store/useOnlineChessStore";

export const Winner = () => {
  const { isCheckMate } = useChessStore((state) => state);

  if (isCheckMate !== "noCheckMate") {
    return (
      <Dialog open={true}>
        <DialogContent className="w-fit p-5 rounded-lg">
          <DialogHeader>
            <DialogTitle>
              <h1 className="text-2xl font-semibold">Game Over</h1>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg font-semibold">
              {isCheckMate === "black"
                ? "White"
                : isCheckMate === "draw"
                ? "Draw"
                : "Black"}{" "}
              wins!
            </DialogDescription>
            <div className="mt-4 flex justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
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
    );
  }

  return null;
};
