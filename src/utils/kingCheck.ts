import { Board } from "@/store/useChessStore";
import { isMoveValid } from "./validMove";
import { typeCheckMate } from "@/types/chess";
import { isMovePossible } from "./possibleMove";

export const isKingInCheck = (
  Board: Board,
  player: "white" | "black"
): boolean => {
  const king = player === "white" ? "K" : "k";
  let kingRow = -1;
  let kingCol = -1;

  // Find the king's position
  for (let row = 0; row < Board.length; row++) {
    for (let col = 0; col < Board[row].length; col++) {
      if (Board[row][col] === king) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
    if (kingRow !== -1) break;
  }

  // Check for threats to the king
  for (let row = 0; row < Board.length; row++) {
    for (let col = 0; col < Board[row].length; col++) {
      const piece = Board[row][col];
      if (
        piece &&
        (player === "white"
          ? piece === piece.toLowerCase()
          : piece === piece.toUpperCase())
      ) {
        if (isMoveValid(Board, row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isCheckMate = (
  board: Board,
  player: "white" | "black"
): typeCheckMate => {
  if (!isKingInCheck(board, player)) {
    return "noCheckMate";
  }

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (
        board[row][col] &&
        (player === "white"
          ? board[row][col] === board[row][col]?.toUpperCase()
          : board[row][col] === board[row][col]?.toLowerCase())
      ) {
        for (let toRow = 0; toRow < board.length; toRow++) {
          for (let toCol = 0; toCol < board[toRow].length; toCol++) {
            if (isMovePossible(board, row, col, toRow, toCol)) {
              const newBoard = board.map((row) => row.slice());
              newBoard[toRow][toCol] = board[row][col];
              newBoard[row][col] = null;

              if (!isKingInCheck(newBoard, player)) return "noCheckMate";
              else return "draw";
            }
          }
        }
      }
    }
  }

  return player;
};
