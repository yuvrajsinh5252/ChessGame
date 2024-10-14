"use server";

import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";

export async function getGameState(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });

  if (!game) {
    throw new Error("Game not found");
  }

  return {
    board: JSON.parse(game.board),
    currentPlayer: game.currentPlayer,
  };
}

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

  if (currentPlayer !== player) {
    throw new Error("Not your turn");
  }

  const newCurrentPlayer = currentPlayer === "white" ? "black" : "white";

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      board: JSON.stringify(board),
      currentPlayer: newCurrentPlayer,
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "move", {
    board,
    currentPlayer: newCurrentPlayer,
  });

  return { board, currentPlayer: newCurrentPlayer };
}

export async function getPlayerColor(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });

  return player?.color;
}
