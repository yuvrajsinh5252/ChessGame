"use server";

import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";
import { Board } from "@/store/useChessStore";
import { GameState, winner } from "@/types/onlineChess";
import { isKingInCheck } from "@/utils/kingCheck";

//  This function is used to get the game state from the database
export async function getGameState(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  const players = await prisma.player.findMany({
    where: { gameId },
  });

  if (!game) throw new Error("Game not found");

  return { gameState: game, players };
}

export async function getPlayerColor(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  return player?.color as "white" | "black" | null;
}

export async function serverPawnPromote(
  gameId: string,
  { row, col, piece }: { row: number; col: number; piece: string }
) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  const board: Board = JSON.parse(game.board);
  const lastMove = game.lastMove ? JSON.parse(game.lastMove) : null;
  const rookMoved = JSON.parse(game.rookMoved);
  const kingCheckOrMoved = JSON.parse(game.kingCheckOrMoved);
  const eliminatedPieces = JSON.parse(game.eliminatedPiece);
  const currentPlayer = game.currentPlayer;

  const newBoard = board.map((row) => [...row]);
  newBoard[row][col] = currentPlayer === "black" ? piece.toLowerCase() : piece;

  const gameState: GameState = {
    board: newBoard,
    currentPlayer: currentPlayer === "white" ? "black" : "white",
    winner: game.winner as winner,
    isKingInCheck: isKingInCheck(
      newBoard,
      currentPlayer === "white" ? "black" : "white"
    )
      ? currentPlayer === "black"
        ? "K"
        : "k"
      : "noCheck",
    canPromotePawn: null,
    status: "in-progress",
    eliminatedPieces: eliminatedPieces,
    lastMove: lastMove,
    kingCheckOrMoved: kingCheckOrMoved,
    rookMoved: rookMoved,
    movingPiece: null,
  };

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      currentPlayer: currentPlayer === "white" ? "black" : "white",
      board: JSON.stringify(newBoard),
      isKingInCheck: gameState.isKingInCheck,
      canPawnPromote: JSON.stringify({}),
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "promote", gameState);

  return "Pawn promoted successfully";
}

export async function handlePlayerResign(gameId: string, playerId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  const players = await prisma.player.findMany({ where: { gameId } });

  const winner = players.find((player) => player.id === playerId)
    ?.color as winner;

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      winner,
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "resign", {
    winner,
    status: "resigned",
  });
  return "Player resigned";
}

export async function deleteGame(gameId: string) {
  try {
    const game = await prisma.game.findUnique({ where: { roomId: gameId } });
    if (!game) throw new Error("Game not found");

    await prisma.player.deleteMany({ where: { gameId } });
    await prisma.game.delete({ where: { roomId: gameId } });
    return "Game deleted";
  } catch (error) {
    return "Error";
  }
}
