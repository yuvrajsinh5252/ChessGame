import { Board } from "@/store/useChessStore";
import { kingCheckOrMoved, rookMoved } from "@/types/chess";
import { isKingInCheck } from "./valid-move";

export const CheckCastling = (
  piece: string,
  fromRow: number,
  fromCol: number,
  toCol: number,
  board: Board,
  currentPlayer: "white" | "black",
  rookMoved: rookMoved,
  kingCheckOrMoved: kingCheckOrMoved
): boolean => {
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
          return false;
        }
      }

      // Move the rook to the correct position
      const newRookCol = fromCol + direction;
      board[fromRow][newRookCol] = rook;
      board[fromRow][rookCol] = null;

      return true;
    }
  }

  return false;
};
