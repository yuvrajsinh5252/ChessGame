"use client";

import { useChessStore } from "@/store/useChessStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import Image from "next/image";
import { useThemeStore } from "@/store/useThemeStore";

export const ChoosePiece = () => {
  const { pieceTheme } = useThemeStore((state) => state);
  const { currentPlayer, canPromotePawn, promotePawn, computer } =
    useChessStore((state) => state);

  if (currentPlayer === computer) return null;

  if (!canPromotePawn) return null;
  return (
    <Dialog open={true}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a piece to promote your pawn to</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {["Q", "R", "B", "N"].map((piece) => (
                <button key={piece} className="btn">
                  <Image
                    src={`/${pieceTheme}/${
                      currentPlayer === "white" ? "black" : "white"
                    }/${piece}.png`}
                    alt={piece}
                    width={64}
                    height={64}
                    className="mt-5 hover:scale-110 transform transition-transform hover:bg-gray-200 rounded-lg"
                    onClick={() => {
                      promotePawn(
                        canPromotePawn.row,
                        canPromotePawn.col,
                        piece
                      );
                    }}
                  />
                </button>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
