import { Board } from "@/store/useChessStore";

export const isValidMove = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean | "" | null => {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const isWhite = piece === piece.toUpperCase();
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

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
            board[toRow][toCol] !== board[toRow][toCol]?.toUpperCase())
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
            board[toRow][toCol]?.toUpperCase() === board[toRow][toCol])
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
