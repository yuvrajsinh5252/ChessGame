"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { getGameState, getPlayerColor } from "@/lib/db/game";
import { OnlineChessPiece } from "./onlinechessPiece";
import { LoadingBoard } from "../loadingBoard";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import { PieceType } from "@/types/chess";
import { GameState, Player, winner } from "@/types/onlineChess";
import { handlePlayerMove } from "@/lib/db/handle-move";

export function OnlineBoard({
  roomId,
  playerId,
}: {
  roomId: string;
  playerId: string;
}) {
  const {
    players,
    gameState,
    updateGameState,
    updatePlayersState,
    isValidMove,
    movePiece,
  } = useOnlineChessStore((state) => state);

  const [isLoading, setisLoading] = useState(true);
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(
    null
  );
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const data = await getGameState(roomId);
        const playerColour = await getPlayerColor(playerId);
        if (playerColour) setPlayerColor(playerColour);

        const recievedGameState: GameState = {
          board: JSON.parse(data.gameState.board),
          status: "in-progress",
          currentPlayer: data.gameState.currentPlayer as "white" | "black",
          lastMove: data.gameState.lastMove
            ? JSON.parse(data.gameState.lastMove)
            : null,
          eliminatedPieces: JSON.parse(data.gameState.eliminatedPiece) as {
            white: string[];
            black: string[];
          },
          kingCheckOrMoved: JSON.parse(data.gameState.kingCheckOrMoved),
          rookMoved: JSON.parse(data.gameState.rookMoved),
          isKingInCheck: data.gameState.isKingInCheck as "noCheck" | "K" | "k",
          canPromotePawn:
            data.gameState.canPawnPromote === "{}"
              ? null
              : JSON.parse(data.gameState.canPawnPromote),
          winner: data.gameState.winner as winner,
          movingPiece: null,
        };

        const recievedPlayers: Player[] = data.players.map((player: any) => ({
          id: player.id,
          color: player.color,
          gameId: player.gameId,
          drawRequest: player.drawRequest,
        }));

        updateGameState(recievedGameState);
        updatePlayersState(recievedPlayers);

        setisLoading(false);
      } catch (error) {
        console.error("Failed to fetch game state:", error);
      }
    };

    fetchGameState();

    const channel = pusherClient.subscribe(`room-${roomId}`);
    channel.bind("move", (data: GameState) => updateGameState(data));
    channel.bind("promote", (data: GameState) => updateGameState(data));
    channel.bind("resign", (data: { winner: winner; status: "resigned" }) =>
      updateGameState({
        ...gameState,
        winner: data.winner,
        status: data.status,
      })
    );
    channel.bind("drawAccepted", (data: { status: "draw" }) =>
      updateGameState({
        ...gameState,
        winner: data.status,
      })
    );
    channel.bind("drawDeclined", (data: { status: "declined" }) => {
      const newPlayers: Player[] = players.map((player) => ({
        ...player,
        drawRequest: false,
      }));
      console.log(newPlayers, players);
      updatePlayersState(newPlayers);
    });

    return () => {
      channel.unbind("promote");
      channel.unbind("resign");
      channel.unbind("move");
      channel.unbind("drawAccepted");
      channel.unbind("drawDeclined");
      pusherClient.unsubscribe(`room-${roomId}`);
    };
  }, [roomId, getGameState, updateGameState, setisLoading, pusherClient]);

  useEffect(() => {
    const newChnanel = pusherClient.subscribe(`room-${playerId}`);
    newChnanel.bind("draw", (data: { status: "draw" }) => {
      const newPlayers: Player[] = players.map((player) =>
        player.id === playerId ? { ...player, drawRequest: true } : player
      );
      updatePlayersState(newPlayers);
    });

    return () => {
      newChnanel.unbind("draw");
      pusherClient.unsubscribe(`room-${playerId}`);
    };
  }, [pusherClient, updatePlayersState, players]);

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    toRow: number,
    toCol: number
  ) => {
    e.preventDefault();
    const [fromRow, fromCol] = e.dataTransfer
      .getData("text")
      .split(",")
      .map(Number);

    if (playerColor !== gameState.currentPlayer) return;
    const OriginalGameState = { ...gameState };

    movePiece(fromRow, fromCol, toRow, toCol);
    handlePlayerMove(
      roomId,
      { row: fromRow, col: fromCol },
      { row: toRow, col: toCol },
      playerColor!
    ).then((res) => {
      if (res !== "Move successful") updateGameState(OriginalGameState);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // remove selected piece if the current player changes
  useEffect(() => {
    setSelectedPiece(null);
  }, [gameState.currentPlayer]);

  const handlePieceClick = async (row: number, col: number) => {
    if (gameState.board && !gameState.board[row][col]) return;
    if (playerColor !== gameState.currentPlayer) return;
    if (
      gameState.currentPlayer === "black" &&
      gameState.board[row][col] === gameState.board[row][col]?.toUpperCase()
    )
      return;
    if (
      gameState.currentPlayer === "white" &&
      gameState.board[row][col] === gameState.board[row][col]?.toLowerCase()
    )
      return;

    setSelectedPiece((prev) => {
      if (!prev) return { row, col };
      if (prev.row === row && prev.col === col) return null;
      if (isValidMove(prev.row, prev.col, row, col)) {
        movePiece(prev.row, prev.col, row, col);
        return null;
      }
      return { row, col };
    });
  };

  const handleCellClick = async (row: number, col: number) => {
    if (
      selectedPiece &&
      isValidMove(selectedPiece.row, selectedPiece.col, row, col)
    ) {
      const OriginalGameState = { ...gameState };

      movePiece(selectedPiece.row, selectedPiece.col, row, col);
      setSelectedPiece(null);

      const res = await handlePlayerMove(
        roomId,
        selectedPiece,
        { row, col },
        playerColor!
      );

      if (res !== "Move successful") updateGameState(OriginalGameState);
    } else handlePieceClick(row, col);
  };

  if (isLoading) return <LoadingBoard />;

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div
        className={`grid grid-cols-8 gap-0 border-2 rounded-lg relative ${
          playerColor === "black" ? "rotate-180" : ""
        }`}
      >
        {gameState?.board.map((row: any[], rowIndex: number) =>
          row.map((cell: PieceType, colIndex: number) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`h-16 w-16 max-sm:h-10 max-sm:w-10 flex justify-center items-center
              ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"}
              ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"}
              ${rowIndex === 0 && colIndex === 0 ? "rounded-tl-lg" : ""}
              ${rowIndex === 0 && colIndex === 7 ? "rounded-tr-lg" : ""}
              ${rowIndex === 7 && colIndex === 0 ? "rounded-bl-lg" : ""}
              ${rowIndex === 7 && colIndex === 7 ? "rounded-br-lg" : ""}
              ${
                selectedPiece?.row === rowIndex &&
                selectedPiece?.col === colIndex
                  ? "bg-gradient-to-br from-blue-300 to-blue-600"
                  : ""
              }
              ${
                gameState.board[rowIndex][colIndex] === gameState.isKingInCheck
                  ? "bg-gradient-to-br from-red-500 to-red-700"
                  : ""
              }
              `}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onDragOver={handleDragOver}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              <OnlineChessPiece
                type={cell}
                movingPiece={gameState.movingPiece}
                position={{ row: rowIndex, col: colIndex }}
                lastMove={gameState.lastMove}
                currentPlayer={gameState.currentPlayer}
                playerColor={playerColor!}
                setSelectedPiece={setSelectedPiece}
                highlight={
                  !!selectedPiece &&
                  isValidMove(
                    selectedPiece.row,
                    selectedPiece.col,
                    rowIndex,
                    colIndex
                  )
                }
              />
            </div>
          ))
        )}
        {/* Add symbolic notation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`row-${index}`}
              className={`absolute left-0 w-4 h-16 max-sm:h-11 max-sm:w-3 flex items-center justify-center text-[8px] max-sm:text-[6px] text-black ${
                playerColor === "black" ? "rotate-180" : ""
              }`}
              style={{ top: `${index * 12.5 - 4}%` }}
            >
              {8 - index}
            </div>
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`col-${index}`}
              className={`absolute bottom-0 w-16 h-4 max-sm:h-3 max-sm:w-11 flex items-center justify-center text-[8px] max-sm:text-[6px] text-black ${
                playerColor === "black" ? "rotate-180" : ""
              }`}
              style={{ left: `${index * 12.5 - 5}%` }}
            >
              {String.fromCharCode(97 + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
