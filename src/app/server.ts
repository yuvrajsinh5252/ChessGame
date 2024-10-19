"use server";

import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";
import { Board } from "@/store/useChessStore";
import { GameState, winner } from "@/types/onlineChess";
import { checkCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import { isCheckMate, isKingInCheck } from "@/utils/kingCheck";
import { isMovePossible } from "@/utils/possibleMove";
import { promotePawn } from "@/utils/promotePawn";

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
    const eliminatedPieces = JSON.parse(game.eliminatedPiece);
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

    let EliminatedPiece = null;

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
    let OpponentKingCheck = false;
    if (isKingInCheck(newBoard, currentPlayer === "white" ? "black" : "white"))
      OpponentKingCheck = true;

    const gameState: GameState = {
      board: newBoard,
      isKingInCheck: OpponentKingCheck
        ? currentPlayer === "white"
          ? "k"
          : "K"
        : "noCheck",
      kingCheckOrMoved:
        (currentPlayer === "black" && to.row === 0) ||
        (currentPlayer === "white" && to.row === 7) ||
        (piece === "K" &&
          from.row === 7 &&
          from.col === 4 &&
          to.row === 7 &&
          to.col === 6) ||
        (piece === "k" &&
          from.row === 0 &&
          from.col === 4 &&
          to.row === 0 &&
          to.col === 6) ||
        OpponentKingCheck
          ? OpponentKingCheck
            ? {
                ...kingCheckOrMoved,
                [currentPlayer === "white" ? "black" : "white"]: true,
              }
            : {
                ...kingCheckOrMoved,
                [currentPlayer]: true,
              }
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
        ...eliminatedPieces,
        [currentPlayer === "white" ? "black" : "white"]: [
          ...eliminatedPieces[currentPlayer === "white" ? "black" : "white"],
          EliminatedPiece,
        ],
      },
      canPromotePawn: promotePawn(
        board,
        from.row,
        from.col,
        to.row,
        to.col,
        currentPlayer
      ),
      winner:
        isCheckMate(newBoard, newCurrentPlayer) === "noCheckMate"
          ? "none"
          : (isCheckMate(newBoard, newCurrentPlayer) as winner),
    };

    if (gameState.canPromotePawn) {
      gameState.currentPlayer = currentPlayer;
      gameState.status = "promote";
    }

    await pusherServer.trigger(`room-${gameId}`, "move", gameState);

    const res = isCheckMate(newBoard, newCurrentPlayer);
    const winner = res === "noCheckMate" ? "none" : res;

    await prisma.game.update({
      where: { roomId: gameId },
      data: {
        board: JSON.stringify(newBoard),
        winner: winner,
        currentPlayer: gameState.canPromotePawn
          ? currentPlayer
          : newCurrentPlayer,
        lastMove: JSON.stringify(gameState.lastMove),
        kingCheckOrMoved: JSON.stringify(gameState.kingCheckOrMoved),
        rookMoved: JSON.stringify(gameState.rookMoved),
        isKingInCheck: gameState.isKingInCheck,
        eliminatedPiece: JSON.stringify(gameState.eliminatedPieces),
        canPawnPromote: JSON.stringify(
          gameState.canPromotePawn === null ? {} : gameState.canPromotePawn
        ),
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

export async function handlePlayerDraw(gameId: string, playerId: string) {
  try {
    const game = await prisma.game.findUnique({ where: { roomId: gameId } });
    if (!game) throw new Error("Game not found");

    const players = await prisma.player.findMany({ where: { gameId } });

    const player = players.find((player) => player.id !== playerId);
    if (!player) throw new Error("Player not found");

    await pusherServer.trigger(`room-${player.id}`, "draw", { status: "draw" });
    return "Player requested draw";
  } catch (error) {
    return "Error";
  }
}

export async function drawAccepted(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      winner: "draw",
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "drawAccepted", {
    status: "draw",
  });
  return "Draw accepted";
}

export async function drawDeclined(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  await pusherServer.trigger(`room-${gameId}`, "drawDeclined", {
    status: "declined",
  });
  return "Draw declined";
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
