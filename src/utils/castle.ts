import { Board } from "@/store/useChessStore";
import { kingCheckOrMoved, rookMoved } from "@/types/chess";
import { isKingInCheck } from "./kingCheck";

export const checkCastling = (
  fromRow: number,
  fromCol: number,
  toCol: number,
  board: Board,
  currentPlayer: "white" | "black",
  rookMoved: rookMoved,
  kingCheckOrMoved: kingCheckOrMoved
): {
  rook: string;
  rookCol: number;
  newRookCol: number;
} | null => {
  const piece = board[fromRow][fromCol];
  if (!piece) return null;

  if (piece.toLowerCase() === "k" && Math.abs(fromCol - toCol) === 2) {
    const direction = toCol - fromCol > 0 ? 1 : -1;
    const rookCol = direction === 1 ? 7 : 0;
    const rook = board[fromRow][rookCol];

    if (
      rook &&
      rook.toLowerCase() === "r" &&
      !rookMoved[currentPlayer][direction === 1 ? "right" : "left"] &&
      !kingCheckOrMoved[currentPlayer] &&
      !isKingInCheck(board, currentPlayer)
    ) {
      for (let col = fromCol + direction; col !== rookCol; col += direction) {
        if (board[fromRow][col] || isKingInCheck(board, currentPlayer)) {
          return null;
        }
      }

      // Move the rook to the correct position
      const newRookCol = fromCol + direction;
      return { rook, rookCol, newRookCol };
    }
  }

  return null;
};
