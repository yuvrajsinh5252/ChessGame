"use client";

import { useChessStore } from "@/store/useChessStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";

export function ChooseColor() {
  const {
    computer,
    updateComputer,
    computerMove,
    board,
    lastMove,
    kingCheckOrMoved,
    rookMoved,
    stockfishLevel,
    updateStockfishLevel,
  } = useChessStore((state) => state);
  if (computer) return null;

  return (
    <Dialog open={true}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[400px] p-4 sm:p-6 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            VS Computer
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-center">Difficulty</h3>
            <div className="flex gap-2 sm:gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${
                    stockfishLevel === level
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => updateStockfishLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-center">Color</h3>
            <div className="flex gap-4 sm:gap-6 justify-center">
              <div className="text-center">
                <Button
                  className="p-4 sm:p-6 hover:bg-gray-100"
                  variant={"outline"}
                  onClick={() => updateComputer("black")}
                >
                  <Image
                    src="/default/white/K.png"
                    alt="White"
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                </Button>
                <p className="text-xs sm:text-sm mt-1">White</p>
              </div>
              <div className="text-center">
                <Button
                  className="p-4 sm:p-6 hover:bg-gray-100"
                  variant={"outline"}
                  onClick={() => {
                    updateComputer("white");
                    computerMove({
                      board,
                      color: "white",
                      lastMove,
                      rookMoved,
                      kingCheckOrMoved,
                      numberOfFullMoves: 1,
                      fiftyMoveRuleCounter: 0,
                    });
                  }}
                >
                  <Image
                    src="/default/black/k.png"
                    alt="Black"
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                </Button>
                <p className="text-xs sm:text-sm mt-1">Black</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
