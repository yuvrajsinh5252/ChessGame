import { Board } from "@/store/useChessStore";

export const promotePawn = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentPlayer: "white" | "black"
): boolean => {
  const piece = board[fromRow][fromCol];
  if (piece !== (currentPlayer === "white" ? "P" : "p")) return false;
  if (currentPlayer === "white" && toRow !== 0) return false;
  if (currentPlayer === "black" && toRow !== 7) return false;
  if (toCol < 0 || toCol > 7) return false;
  if (board[toRow][toCol]) return false;

  board[toRow][toCol] = currentPlayer === "white" ? "Q" : "q";
  board[fromRow][fromCol] = "";
  return true;
};
