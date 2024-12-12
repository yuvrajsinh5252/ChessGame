export type StockfishQueryParams = {
  fen: string;
  depth: number;
  mode: "easy" | "medium" | "hard" | "bestmove";
};

export type ChessMove = {
  prevX: number;
  prevY: number;
  newX: number;
  newY: number;
  promotedPiece?: string | null;
};

export type StockfishResponse = {
  success: boolean;
  data: string;
};
