import { Board } from "@/store/useChessStore";
import { useChessStore } from "@/store/useChessStore";

let lastMove: {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
} | null = null;

export const isValidMove = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean | "" | null => {
  if (fromRow === toRow && fromCol === toCol) return null;
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const isWhite = piece === piece.toUpperCase();
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  const moveIsValid = (() => {
    switch (piece.toLowerCase()) {
      case "p": // Pawn
        if (isWhite) {
          return (
            (dy === -1 && dx === 0 && !board[toRow][toCol]) ||
            (dy === -2 &&
              dx === 0 &&
              fromRow === 6 &&
              !board[toRow][toCol] &&
              !board[toRow + 1][toCol]) ||
            (dy === -1 &&
              Math.abs(dx) === 1 &&
              board[toRow][toCol] &&
              board[toRow][toCol] !== board[toRow][toCol]?.toUpperCase()) ||
            (dy === -1 &&
              Math.abs(dx) === 1 &&
              fromRow === 3 &&
              lastMove &&
              lastMove.toRow === 3 &&
              lastMove.fromRow === 1 &&
              lastMove.toCol === toCol &&
              board[toRow + 1][toCol]?.toLowerCase() === "p")
          );
        } else {
          return (
            (dy === 1 && dx === 0 && !board[toRow][toCol]) ||
            (dy === 2 &&
              dx === 0 &&
              fromRow === 1 &&
              !board[toRow][toCol] &&
              !board[toRow - 1][toCol]) ||
            (dy === 1 &&
              Math.abs(dx) === 1 &&
              board[toRow][toCol] &&
              board[toRow][toCol]?.toUpperCase() === board[toRow][toCol]) ||
            (dy === 1 &&
              Math.abs(dx) === 1 &&
              fromRow === 4 &&
              lastMove &&
              lastMove.toRow === 4 &&
              lastMove.fromRow === 6 &&
              lastMove.toCol === toCol &&
              board[toRow - 1][toCol]?.toLowerCase() === "p")
          );
        }
      case "r": // Rook
        return (
          (dx === 0 || dy === 0) &&
          !hasObstacles(board, fromRow, fromCol, toRow, toCol)
        );
      case "n": // Knight
        return (
          (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
          (Math.abs(dx) === 1 && Math.abs(dy) === 2)
        );
      case "b": // Bishop
        return (
          Math.abs(dx) === Math.abs(dy) &&
          !hasObstacles(board, fromRow, fromCol, toRow, toCol)
        );
      case "q": // Queen
        return (
          (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) &&
          !hasObstacles(board, fromRow, fromCol, toRow, toCol)
        );
      case "k": // King
        return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
      default:
        return false;
    }
  })();

  if (!moveIsValid) return false;

  // Simulate the move
  const newBoard = board.map((row) => row.slice());
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;

  // Handle en passant capture
  if (
    piece.toLowerCase() === "p" &&
    Math.abs(dx) === 1 &&
    !board[toRow][toCol]
  ) {
    if (isWhite) {
      newBoard[toRow + 1][toCol] = null;
    } else {
      newBoard[toRow - 1][toCol] = null;
    }
  }

  useChessStore.setState((state) => {
    return { ...state, board: newBoard };
  });

  // Check if the move puts the player's own king in check
  let check: "noCheck" | "K" | "k" | undefined = "noCheck";

  if (isKingInCheck(newBoard, isWhite)) check = isWhite ? "K" : "k";

  useChessStore.setState((state) => ({
    ...state,
    board: newBoard,
    isKingInCheck: check,
  }));

  if (check !== "noCheck") return false;
  // Update last move
  lastMove = { fromRow, fromCol, toRow, toCol };

  return true;
};

// Check if the king is in check
const isKingInCheck = (board: Board, isWhite: boolean): boolean => {
  const king = isWhite ? "K" : "k";
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
        (isWhite
          ? piece === piece.toLowerCase()
          : piece === piece.toUpperCase())
      ) {
        if (isValidMove(board, row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const hasObstacles = (
  board: Board,
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
    if (board[y][x] !== null) return true;
    x += dx;
    y += dy;
  }

  return false;
};
