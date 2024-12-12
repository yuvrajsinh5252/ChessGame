import { Board } from "@/store/useChessStore";
import {
  kingCheckOrMoved,
  NullableLastMove,
  PieceColor,
  rookMoved,
} from "@/types/chess";

export function ConvertBoardToFEN(
  board: Board,
  computerColor: PieceColor,
  lastMove: NullableLastMove,
  rookMoved: rookMoved,
  kingCheckOrMoved: kingCheckOrMoved,
  numberOfFullMoves: number,
  fiftyMoveRuleCounter: number
): string {
  let FEN: string = "";

  for (let i = 0; i < 8; i++) {
    let FENRow: string = "";
    let consecutiveEmptySquaresCounter = 0;

    for (const piece of board[i]) {
      if (!piece) {
        consecutiveEmptySquaresCounter++;
        continue;
      }

      if (consecutiveEmptySquaresCounter !== 0)
        FENRow += String(consecutiveEmptySquaresCounter);

      consecutiveEmptySquaresCounter = 0;
      FENRow += piece;
    }

    if (consecutiveEmptySquaresCounter !== 0)
      FENRow += String(consecutiveEmptySquaresCounter);

    FEN += i === 7 ? FENRow : FENRow + "/";
  }

  const player: string = computerColor === "white" ? "w" : "b";
  FEN += " " + player;
  FEN += " " + castlingAvailability(rookMoved, kingCheckOrMoved);
  FEN += " " + enPassantPossibility(lastMove, computerColor, board);
  FEN += " " + fiftyMoveRuleCounter * 2;
  FEN += " " + numberOfFullMoves;

  console.log("FEN ", FEN);
  return FEN;
}

function castlingAvailability(
  rookMoved: rookMoved,
  kingCheckOrMoved: kingCheckOrMoved
): string {
  let castlingAvailability: string = "";

  if (!rookMoved.white.right && !kingCheckOrMoved.white)
    castlingAvailability += "K";
  if (!rookMoved.white.left && !kingCheckOrMoved.white)
    castlingAvailability += "Q";
  if (!rookMoved.black.right && !kingCheckOrMoved.black)
    castlingAvailability += "k";
  if (!rookMoved.black.left && !kingCheckOrMoved.black)
    castlingAvailability += "q";

  return castlingAvailability === "" ? "-" : castlingAvailability;
}

function enPassantPossibility(
  lastMove: NullableLastMove,
  playerColor: PieceColor,
  board: Board
): string {
  if (!lastMove) return "-";

  const { fromRow, toRow, toCol } = lastMove;
  const piece = board[toRow][toCol];

  if (piece?.toLowerCase() === "p" && Math.abs(fromRow - toRow) === 2) {
    if (playerColor === "white") return `${String.fromCharCode(toCol + 97)}3`;
    if (playerColor === "black") return `${String.fromCharCode(toCol + 97)}6`;
  }

  return "-";
}
