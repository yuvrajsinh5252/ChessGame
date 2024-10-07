import { Board } from "@/store/useChessStore";
import { IsMoveValid } from "@/types/chess";

export const isMoveValid: IsMoveValid = (
  Board,
  fromRow,
  fromCol,
  toRow,
  toCol
) => {
  if (fromRow === toRow && fromCol === toCol) return false;
  const piece = Board[fromRow][fromCol];
  const target = Board[toRow][toCol];
  if (!piece) return false;
  if (
    piece &&
    target &&
    (piece.toUpperCase() === piece
      ? target.toUpperCase() === target
      : target.toLowerCase() === target)
  )
    return false;

  const isWhite = piece === piece.toUpperCase();
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  const moveIsValid = (() => {
    switch (piece.toLowerCase()) {
      case "p": // Pawn
        if (isWhite) {
          return (
            (dy === -1 && dx === 0 && !Board[toRow][toCol]) ||
            (dy === -2 &&
              dx === 0 &&
              fromRow === 6 &&
              !Board[toRow][toCol] &&
              !Board[toRow + 1][toCol]) ||
            (dy === -1 &&
              Math.abs(dx) === 1 &&
              Board[toRow][toCol] &&
              Board[toRow][toCol] !== Board[toRow][toCol]?.toUpperCase()) ||
            (dy === -1 &&
              Math.abs(dx) === 1 &&
              fromRow === 3 &&
              Board[toRow + 1][toCol]?.toLowerCase() === "p")
          );
        } else {
          return (
            (dy === 1 && dx === 0 && !Board[toRow][toCol]) ||
            (dy === 2 &&
              dx === 0 &&
              fromRow === 1 &&
              !Board[toRow][toCol] &&
              !Board[toRow - 1][toCol]) ||
            (dy === 1 &&
              Math.abs(dx) === 1 &&
              Board[toRow][toCol] &&
              Board[toRow][toCol]?.toUpperCase() === Board[toRow][toCol]) ||
            (dy === 1 &&
              Math.abs(dx) === 1 &&
              fromRow === 4 &&
              Board[toRow - 1][toCol]?.toLowerCase() === "p")
          );
        }
      case "r": // Rook
        return (
          (dx === 0 || dy === 0) &&
          !hasObstacles(Board, fromRow, fromCol, toRow, toCol)
        );
      case "n": // Knight
        return (
          (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
          (Math.abs(dx) === 1 && Math.abs(dy) === 2)
        );
      case "b": // Bishop
        return (
          Math.abs(dx) === Math.abs(dy) &&
          !hasObstacles(Board, fromRow, fromCol, toRow, toCol)
        );
      case "q": // Queen
        return (
          (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) &&
          !hasObstacles(Board, fromRow, fromCol, toRow, toCol)
        );
      case "k": // King
        return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
      default:
        return false;
    }
  })();

  if (!moveIsValid) return false;
  return true;
};

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

export const hasObstacles = (
  Board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  const dx = Math.sign(toCol - fromCol);
  const dy = Math.sign(toRow - fromRow);
  let x = fromCol + dx;
  let y = fromRow + dy;

  while (x !== toCol || y !== toRow) {
    if (Board[y][x] !== null) return true;
    x += dx;
    y += dy;
  }

  return false;
};
