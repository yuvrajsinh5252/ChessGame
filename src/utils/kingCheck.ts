import { Board } from "@/store/useChessStore";
import { isMoveValid } from "./validMove";
import { typeCheckMate } from "@/types/chess";
import { isMovePossible } from "./possibleMove";

export const isKingInCheck = (
  board: Board,
  player: "white" | "black"
): boolean => {
  const king = player === "white" ? "K" : "k";
  let kingRow = -1;
  let kingCol = -1;

  // Find the king's position
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === king) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
    if (kingRow !== -1) break;
  }

  // Check for threats to the king
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (
        piece &&
        (player === "white"
          ? piece === piece.toLowerCase()
          : piece === piece.toUpperCase())
      ) {
        if (isMoveValid(board, row, col, kingRow, kingCol)) {
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
  if (isInsufficientMaterial(board)) {
    return "draw";
  }

  const inCheck = isKingInCheck(board, player);
  let hasLegalMove = false;

  hasLegalMove = false;

  outerLoop: for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (
        piece &&
        (player === "white"
          ? piece === piece.toUpperCase()
          : piece === piece.toLowerCase())
      ) {
        for (let toRow = 0; toRow < board.length; toRow++) {
          for (let toCol = 0; toCol < board[toRow].length; toCol++) {
            if (isMovePossible(board, row, col, toRow, toCol, player)) {
              const newBoard = board.map((row) => row.slice());
              newBoard[toRow][toCol] = board[row][col];
              newBoard[row][col] = null;

              if (!isKingInCheck(newBoard, player)) {
                hasLegalMove = true;
                break outerLoop;
              }
            }
          }
        }
      }
    }
  }

  if (hasLegalMove) {
    return "noCheckMate";
  } else {
    if (inCheck) {
      return player; // The player is checkmated
    } else {
      return "stalemate";
    }
  }
};

const isInsufficientMaterial = (board: Board): boolean => {
  const pieces = board.flat().filter((piece) => piece !== null);

  // Remove kings from the list
  const nonKingPieces = pieces.filter((piece) => piece.toLowerCase() !== "k");

  // If there are no non-king pieces, it's a draw
  if (nonKingPieces.length === 0) {
    return true;
  }

  // If only one minor piece is left, it's a draw
  if (nonKingPieces.length === 1) {
    const piece = nonKingPieces[0].toLowerCase();
    if (piece === "b" || piece === "n") {
      return true;
    }
  }

  return false;
};
