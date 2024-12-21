export type StockfishQueryParams = {
  fen: string;
  depth: number;
};

export type ChessMove = {
  prevX: number;
  prevY: number;
  newX: number;
  newY: number;
  promotedPiece?: string | null;
};

export type StockfishResponse = {
  eval: number;
  depth: number;
  winChance: number;
  move: string;
  continuationArr: string[];
  mate: number | null;
};

export type Stockfish = {
  stockfishLevel: number;
  updateStockfishLevel: (level: number) => void;
};

export const mapStockfishLevel = (level: number): number => {
  switch (level) {
    case 1:
      return 3;
    case 2:
      return 5;
    case 3:
      return 8;
    case 4:
      return 10;
    case 5:
      return 12;
    default:
      return 10;
  }
};
