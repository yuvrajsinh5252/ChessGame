"use client";

import { useChessStore } from "@/store/useChessStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

export const CheckMate = () => {
  const { isCheckMate } = useChessStore((state) => state);

  if (isCheckMate != "noCheckMate") {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkmate</DialogTitle>
            <DialogDescription>
              {isCheckMate === "white" ? "Black" : "White"} wins!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
};
