"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import { serverPawnPromote } from "@/app/server";

export const Promote = ({
  roomId,
  playerColor,
}: {
  roomId: string;
  playerColor: string;
}) => {
  const { gameState, promotePawn } = useOnlineChessStore((state) => state);
  const { currentPlayer, canPromotePawn } = gameState;

  if (!canPromotePawn || playerColor === gameState.currentPlayer) return null;
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
                  <img
                    src={`/${
                      currentPlayer === "white" ? "black" : "white"
                    }/${piece}.png`}
                    alt={piece}
                    className="w-16 h-16 mt-5 hover:scale-110 transform transition-transform hover:bg-gray-200 rounded-lg"
                    onClick={async () => {
                      promotePawn(
                        canPromotePawn.row,
                        canPromotePawn.col,
                        piece
                      );

                      serverPawnPromote(roomId, {
                        row: canPromotePawn.row,
                        col: canPromotePawn.col,
                        piece,
                      });
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
