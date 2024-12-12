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

export function ChooseColor() {
  const {
    computer,
    updateComputer,
    computerMove,
    board,
    lastMove,
    kingCheckOrMoved,
    rookMoved,
  } = useChessStore((state) => state);
  if (computer) return null;

  return (
    <Dialog open={true}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-54">
        <DialogHeader>
          <DialogTitle className="flex justify-center mb-5">
            Choose your color
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2 justify-center items-center">
              <Button onClick={() => updateComputer("black")}>White</Button>
              <Button
                variant={"secondary"}
                className="bg-gray-600 text-white"
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
                Black
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
