import {
  ChessMove,
  mapStockfishLevel,
  StockfishResponse,
} from "@/types/stockfish";

async function postChessApi(data = {}) {
  const response = await fetch("https://chess-api.com/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function moveFromStockfishString(move: string | null): ChessMove {
  if (!move) {
    return {
      prevX: -1,
      prevY: -1,
      newX: -1,
      newY: -1,
      promotedPiece: null,
    };
  }

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

export async function GetBestMove(
  fen: string,
  stockfishLevel: number
): Promise<ChessMove> {
  let response: StockfishResponse = await postChessApi({
    fen: fen,
    depth: mapStockfishLevel(stockfishLevel),
  });

  if (!response.move) {
    response = await postChessApi({
      fen: fen,
      depth: mapStockfishLevel(stockfishLevel),
    });
  }

  // API STOPS WORKING SO I NEED TO SWITCH TO ANOTHER ONE

  // const queryParams: StockfishQueryParams = {
  //   fen,
  //   depth: mapStockfishLevel(stockfishLevel),
  // };

  // let params = new URLSearchParams(queryParams as any).toString();

  // const response = await fetch(`api/proxy?${params}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // // const data = await response.json();
  return moveFromStockfishString(response.move);
}
