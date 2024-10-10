import { Board } from "@/store/useChessStore";
import { typePromotePawn } from "@/types/chess";

export const promotePawn = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentPlayer: "white" | "black"
): typePromotePawn => {
  const piece = board[fromRow][fromCol];
  console.log(fromRow, fromCol, piece);
  if (piece !== (currentPlayer === "white" ? "P" : "p")) return null;
  if (currentPlayer === "white" && toRow === 0) {
    console.log("white");
    return { row: toRow, col: toCol, piece: null };
  }
  if (currentPlayer === "black" && toRow === 7) {
    console.log("black");
    return { row: toRow, col: toCol, piece: null };
  }
  if (toCol < 0 || toCol > 7) return null;

  return null;
};
