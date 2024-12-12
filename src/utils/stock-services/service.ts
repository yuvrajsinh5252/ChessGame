import {
  ChessMove,
  StockfishQueryParams,
  StockfishResponse,
} from "@/types/stockfish";

const stockfihsAPI = "https://stockfish.online/api/stockfish.php";

export function getStockService() {}

function moveFromStockfishString(move: string): ChessMove {
  const prevX = move.charCodeAt(0) - "a".charCodeAt(0);
  const prevY = 8 - parseInt(move[1]);
  const newX = move.charCodeAt(2) - "a".charCodeAt(0);
  const newY = 8 - parseInt(move[3]);
  const promotedPiece = move[4] ? move[4] : null;

  return {
    prevX,
    prevY,
    newX,
    newY,
    promotedPiece,
  };
}

export async function GetBestMove(fen: string): Promise<ChessMove> {
  const queryParams: StockfishQueryParams = {
    fen,
    depth: 20,
    mode: "hard",
  };

  let params = new URLSearchParams(queryParams as any);

  const response = await fetch(`${stockfihsAPI}?${params.toString()}`);
  const data: StockfishResponse = await response.json();
  const bestMove: string = data.bestmove.split(" ")[1];
  return moveFromStockfishString(bestMove);
}
