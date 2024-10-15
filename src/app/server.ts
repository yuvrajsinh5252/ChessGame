"use server";

import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";
import { OnlineChessStore } from "@/types/onlineChess";

//  This function is used to get the game state from the database
export async function getGameState(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  const players = await prisma.player.findMany({
    where: { gameId },
    select: { id: true, color: true },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  return {
    players: players,
    winner: "in-progress",
    gameState: {
      board: JSON.parse(game.board),
      currentPlayer: game.currentPlayer,
      status: "in-progress",
      lastMove: game.lastMove,
      eliminatedPieces: JSON.parse(game.eliminatedPiece),
      kingCheckOrMoved: JSON.parse(game.kingCheckOrMoved),
      rookMoved: JSON.parse(game.rookMoved),
      isKingInCheck: game.isKingInCheck,
    },
  } as OnlineChessStore;
}

//  This function is used to handle the player move
export async function handlePlayerMove(
  gameId: string,
  from: { row: number; col: number },
  to: { row: number; col: number },
  player: "white" | "black"
) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  const board = JSON.parse(game.board);
  const currentPlayer = game.currentPlayer;

  board[to.row][to.col] = board[from.row][from.col];
  board[from.row][from.col] = null;

  const newCurrentPlayer = currentPlayer === "white" ? "black" : "white";

  game.board = board;
  game.currentPlayer = newCurrentPlayer;

  await pusherServer.trigger(`room-${gameId}`, "move", game);

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      board: JSON.stringify(board),
      currentPlayer: newCurrentPlayer,
    },
  });
}

export async function getPlayerColor(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });

  return player?.color;
}
