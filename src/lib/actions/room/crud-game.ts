"use server";

import { prisma } from "@/lib/prisma";

import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";

export async function DeleteRoom(roomId: string) {
  await prisma.player.deleteMany({
    where: {
      gameId: roomId,
    },
  });

  await prisma.game.delete({
    where: {
      roomId: roomId,
    },
  });
}

export async function CreateRoom(playerId: string) {
  const createdRoom = await prisma.game.create({
    data: {
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
      lastMove: JSON.stringify({}),
      eliminatedPiece: JSON.stringify({ white: [], black: [] }),
      kingCheckOrMoved: JSON.stringify(intitialkingCheckOrMoved),
      rookMoved: JSON.stringify(initialRookMoved),
      canPawnPromote: JSON.stringify({}),
    },
  });

  await prisma.player.create({
    data: {
      id: playerId,
      color: "white",
      game: {
        connect: { roomId: createdRoom.roomId },
      },
    },
  });

  return { roomId: createdRoom.roomId };
}

export async function createGame(player1: string, player2: string) {
  const game = await prisma.game.create({
    data: {
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
      lastMove: JSON.stringify({}),
      eliminatedPiece: JSON.stringify({ white: [], black: [] }),
      kingCheckOrMoved: JSON.stringify(intitialkingCheckOrMoved),
      rookMoved: JSON.stringify(initialRookMoved),
      canPawnPromote: JSON.stringify({}),
      isKingInCheck: "noCheck",
      players: {
        create: [
          {
            id: player1,
            color: "white",
          },
          {
            id: player2,
            color: "black",
          },
        ],
      },
    },
  });

  return game;
}
