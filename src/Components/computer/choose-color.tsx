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
    updateStockfishLevel,
  } = useChessStore((state) => state);
  if (computer) return null;

  return (
    <Dialog open={true}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-54">
        <DialogHeader>
          <DialogTitle className="flex text-gray-400 justify-center mb-5">
            Computer strength
          </DialogTitle>
          <DialogDescription>
            <div className="flex gap-4 flex-col">
              <div className="flex gap-2">
                <Button onClick={() => updateStockfishLevel(1)}>1</Button>
                <Button onClick={() => updateStockfishLevel(2)}>2</Button>
                <Button onClick={() => updateStockfishLevel(3)}>3</Button>
                <Button onClick={() => updateStockfishLevel(4)}>4</Button>
                <Button onClick={() => updateStockfishLevel(5)}>5</Button>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <Button
                  className="py-8"
                  variant={"outline"}
                  onClick={() => updateComputer("black")}
                >
                  <Image
                    src="/default/white/K.png"
                    alt="computer"
                    width={40}
                    height={40}
                  />
                </Button>
                <Button
                  className="py-8"
                  variant={"outline"}
                  onClick={() => {
                    updateComputer("white");
                    computerMove({
                      board,
                      color: "white",
                      lastMove,
                      rookMoved,
                      kingCheckOrMoved,
                      numberOfFullMoves: 0,
                      fiftyMoveRuleCounter: 0,
                    });
                  }}
                >
                  <Image
                    src="/default/black/k.png"
                    alt="computer"
                    width={40}
                    height={40}
                  />
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
