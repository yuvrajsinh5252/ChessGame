import { Board } from "@/store/useChessStore";
import { kingCheckOrMoved, rookMoved } from "@/types/chess";

export const checkCastling = (
  fromRow: number,
  fromCol: number,
  toRow: number,
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
  if (
    currentPlayer == "white"
      ? fromRow !== 7 ||
        fromCol !== 4 ||
        toRow !== 7 ||
        (toCol !== 6 && toCol !== 2)
      : fromRow !== 0 || fromCol !== 4 || toRow !== 0 || (toCol !== 6 && toCol)
  )
    return null;
  const piece = board[fromRow][fromCol];
  const rook = board[fromRow][toCol === 6 ? 7 : 0];
  const rookCol = toCol === 6 ? 7 : 0;
  const newRookCol = toCol === 6 ? 5 : 3;

  if (piece !== "K" && piece !== "k") return null;
  if (rook !== (currentPlayer === "white" ? "R" : "r")) return null;
  const rookSide = rookCol === 7 ? "right" : "left";

  if (rookMoved[currentPlayer][rookSide] || kingCheckOrMoved[currentPlayer])
    return null;

  for (
    let col = Math.min(rookCol, newRookCol) + 1;
    col < Math.max(rookCol, newRookCol);
    col++
  ) {
    if (board[fromRow][col]) return null;
  }

  return { rook, rookCol, newRookCol };
};
