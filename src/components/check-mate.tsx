"use client"

import { useChessStore } from "@/store/useChessStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const CheckMate = () => {
  const { isCheckMate } = useChessStore((state) => state);

  if (isCheckMate != "noCheckMate") {
    return (
      <Dialog>
        <DialogTrigger>
          <button className="hidden">Trigger</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkmate</DialogTitle>
            <DialogDescription>
              {isCheckMate === "white" ? "White" : "Black"} wins!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
};
