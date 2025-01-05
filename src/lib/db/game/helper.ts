"use server";

import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { Board } from "@/store/useChessStore";
import { GameState, winner } from "@/types/onlineChess";
import { isKingInCheck } from "@/utils/kingCheck";
import { updateUserStats } from "../analytic/stats";

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
  const game = await prisma.game.findUnique({
    where: { roomId: gameId },
    include: { players: true },
  });
  if (!game) throw new Error("Game not found");

  const resigningPlayer = game.players.find((p) => p.id === playerId);
  const winningPlayer = game.players.find((p) => p.id !== playerId);

  if (!resigningPlayer || !winningPlayer) throw new Error("Players not found");

  await updateUserStats(resigningPlayer.id, "loss");
  await updateUserStats(winningPlayer.id, "win");

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      winner: winningPlayer.color,
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "resign", {
    winner: winningPlayer.color,
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
