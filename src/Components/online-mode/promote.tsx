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
import { serverPawnPromote } from "@/lib/db/game/helper";
import Image from "next/image";
import { useThemeStore } from "@/store/useThemeStore";

export const Promote = ({
  roomId,
  playerColor,
}: {
  roomId: string;
  playerColor: string;
}) => {
  const { gameState, promotePawn } = useOnlineChessStore((state) => state);
  const { currentPlayer, canPromotePawn } = gameState;
  const { pieceTheme } = useThemeStore((state) => state);

  if (!canPromotePawn || playerColor !== gameState.currentPlayer) return null;
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Choose a piece to promote your pawn to
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {["Q", "R", "B", "N"].map((piece) => {
                const pieceImage =
                  currentPlayer === "black" ? piece.toLowerCase() : piece;
                return (
                  <button key={piece} className="btn">
                    <Image
                      src={`/${pieceTheme}/${currentPlayer}/${pieceImage}.png`}
                      alt={piece}
                      width={64}
                      height={64}
                      className="mt-5 hover:scale-110 transform transition-transform hover:bg-gray-200 rounded-lg"
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
                );
              })}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
