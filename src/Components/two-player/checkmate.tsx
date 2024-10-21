"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useChessStore } from "@/store/useChessStore";

export const CheckMate = () => {
  const { isCheckMate } = useChessStore((state) => state);

  if (isCheckMate !== "noCheckMate") {
    return (
      <Dialog open={true}>
        <DialogContent className="w-full max-w-md p-5 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>
              <h1 className="text-2xl font-semibold text-center">Checkmate</h1>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg font-semibold">
              {isCheckMate === "black"
                ? "White"
                : isCheckMate === "draw"
                ? "It's a Draw"
                : "Black"}{" "}
              wins!
            </DialogDescription>
            <div className="text-center text-lg font-semibold">
              {isCheckMate === "draw"
                ? "1/2 - 1/2"
                : isCheckMate === "white"
                ? "1 - 0"
                : "0 - 1"}
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
    );
  }

  return null;
};
