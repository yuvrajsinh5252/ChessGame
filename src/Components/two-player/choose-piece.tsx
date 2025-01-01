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

  const pieces = [
    { key: "Q", name: "Queen" },
    { key: "R", name: "Rook" },
    { key: "B", name: "Bishop" },
    { key: "N", name: "Knight" },
  ];

  return (
    <Dialog open={true}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Pawn Promotion
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Choose a piece to promote your pawn
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-2">
          {pieces.map(({ key, name }) => (
            <button
              key={key}
              className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 space-y-2"
              onClick={() => {
                promotePawn(canPromotePawn.row, canPromotePawn.col, key);
              }}
            >
              <Image
                src={`/${pieceTheme}/${
                  currentPlayer === "white" ? "white" : "black"
                }/${key}.png`}
                alt={name}
                width={50}
                height={50}
                className="transition-transform hover:scale-105"
              />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
