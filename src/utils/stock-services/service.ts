import { ChessMove, StockfishQueryParams } from "@/types/stockfish";

export function getStockService() {}

function moveFromStockfishString(move: string): ChessMove {
  const prevY = move.charCodeAt(0) - "a".charCodeAt(0);
  const prevX = 8 - Number(move[1]);
  const newY = move.charCodeAt(2) - "a".charCodeAt(0);
  const newX = 8 - Number(move[3]);
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
    depth: 13,
    mode: "bestmove",
  };

  let params = new URLSearchParams(queryParams as any).toString();

  const response = await fetch(`api/proxy?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(data);

  const bestMove: string = data.data.split(" ")[1];
  return moveFromStockfishString(bestMove);
}
