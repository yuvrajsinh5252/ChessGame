"use server";

import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";
import { Board } from "@/store/useChessStore";
import { GameState } from "@/types/onlineChess";
import { checkCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import { isKingInCheck } from "@/utils/kingCheck";
import { isMovePossible } from "@/utils/possibleMove";

//  This function is used to get the game state from the database
export async function getGameState(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  const players = await prisma.player.findMany({
    where: { gameId },
  });

  if (!game) throw new Error("Game not found");

  return { gameState: game, players };
}

//  This function is used to handle the player move
export async function handlePlayerMove(
  gameId: string,
  from: { row: number; col: number },
  to: { row: number; col: number },
  player: "white" | "black"
) {
  try {
    const game = await prisma.game.findUnique({ where: { roomId: gameId } });
    if (!game) throw new Error("Game not found");

    if (player != game.currentPlayer) throw new Error("Not your turn");

    const board: Board = JSON.parse(game.board);
    const lastMove = game.lastMove ? JSON.parse(game.lastMove) : null;
    const rookMoved = JSON.parse(game.rookMoved);
    const kingCheckOrMoved = JSON.parse(game.kingCheckOrMoved);
    // const eliminatedPieces = JSON.parse(game.eliminatedPieces);
    const currentPlayer = game.currentPlayer;

    const newBoard = board.map((row) => row.slice());
    const piece = newBoard[from.row][from.col];
    if (!piece) throw new Error("No piece found");

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && !isWhitePiece) ||
      (currentPlayer === "black" && isWhitePiece)
    )
      throw new Error("Invalid move");

    if (
      isMovePossible(
        newBoard,
        from.row,
        from.col,
        to.row,
        to.col,
        currentPlayer,
        lastMove,
        rookMoved,
        kingCheckOrMoved
      )
    ) {
      let EliminatedPiece = null;

      if (
        lastMove &&
        CheckEnpassant(
          newBoard,
          {
            fromRow: from.row,
            fromCol: from.col,
            toRow: to.row,
            toCol: to.col,
          },
          lastMove
        )
      ) {
        EliminatedPiece = newBoard[lastMove.toRow][lastMove.toCol];
        newBoard[lastMove.toRow][lastMove.toCol] = null;
      }

      const data = checkCastling(
        from.row,
        from.col,
        to.row,
        to.col,
        newBoard,
        currentPlayer,
        rookMoved,
        kingCheckOrMoved
      );

      if (data) {
        newBoard[from.row][data.rookCol] = null;
        newBoard[from.row][data.newRookCol] = data.rook;
      }

      // Move the piece to the new position
      if (newBoard[to.row][to.col]) EliminatedPiece = newBoard[to.row][to.col];
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;

      if (isKingInCheck(newBoard, currentPlayer))
        throw new Error("Invalid move");
    } else throw new Error("Invalid move");

    const newCurrentPlayer = currentPlayer === "white" ? "black" : "white";

    const gameState: GameState = {
      board: newBoard,
      isKingInCheck: isKingInCheck(
        newBoard,
        currentPlayer === "white" ? "black" : "white"
      )
        ? currentPlayer === "white"
          ? "k"
          : "K"
        : "noCheck",
      kingCheckOrMoved:
        (currentPlayer === "black" && to.row === 0) ||
        (currentPlayer === "white" && to.row === 7)
          ? { ...kingCheckOrMoved, [currentPlayer]: true }
          : kingCheckOrMoved,
      rookMoved: {
        ...rookMoved,
        [currentPlayer]: {
          left: from.col === 0 || from.col === 4,
          right: from.col === 7 || from.col === 4,
        },
      },
      currentPlayer: newCurrentPlayer,
      status: "in-progress",
      lastMove: {
        fromRow: from.row,
        fromCol: from.col,
        toRow: to.row,
        toCol: to.col,
      },
      eliminatedPieces: {
        white: [],
        black: [],
      },
    };

    await pusherServer.trigger(`room-${gameId}`, "move", gameState);

    await prisma.game.update({
      where: { roomId: gameId },
      data: {
        board: JSON.stringify(newBoard),
        currentPlayer: newCurrentPlayer,
        lastMove: JSON.stringify(gameState.lastMove),
        kingCheckOrMoved: JSON.stringify(gameState.kingCheckOrMoved),
        rookMoved: JSON.stringify(gameState.rookMoved),
        isKingInCheck: gameState.isKingInCheck,
      },
    });

    return "Move successful";
  } catch (error) {
    return "Error";
  }
}

export async function getPlayerColor(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  return player?.color as "white" | "black" | null;
}
