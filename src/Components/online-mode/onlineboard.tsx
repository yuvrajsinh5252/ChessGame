"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { handlePlayerMove, getGameState, getPlayerColor } from "@/app/server";
import { OnlineChessPiece } from "./onlinechessPiece";
import { LoadingBoard } from "../loadingBoard";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import { PieceType } from "@/types/chess";
import { GameState, Player } from "@/types/onlineChess";

export function OnlineBoard({
  roomId,
  playerId,
}: {
  roomId: string;
  playerId: string;
}) {
  const {
    gameState,
    players,
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
        };

        const recievedPlayers: Player[] = (data.players as any).map(
          (player: any) => ({
            id: player.id,
            color: player.color,
          })
        );

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

    return () => {
      channel.unbind("move");
      pusherClient.unsubscribe(`room-${roomId}`);
    };
  }, [roomId, getGameState, updateGameState, setisLoading, pusherClient]);

  const handleCellClick = async (row: number, col: number) => {
    if (selectedPiece) {
      if (!isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        setSelectedPiece(null);
        return;
      }

      const OriginalGameState = { ...gameState };
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
      setSelectedPiece(null);

      const res = await handlePlayerMove(
        roomId,
        selectedPiece,
        { row, col },
        playerColor!
      );
      setSelectedPiece(null);

      if (res == "Error") updateGameState(OriginalGameState);
    } else {
      const { board, currentPlayer } = gameState;

      if (board && !board[row][col]) return;
      if (currentPlayer !== playerColor) return;
      if (
        playerColor === "black" &&
        board[row][col] === board[row][col]?.toUpperCase()
      )
        return;
      if (
        playerColor === "white" &&
        board[row][col] === board[row][col]?.toLowerCase()
      )
        return;

      setSelectedPiece({ row, col });
    }
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
              ${playerColor === "black" ? "rotate-180" : ""}
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              <OnlineChessPiece
                type={cell}
                position={{ row: rowIndex, col: colIndex }}
                lastMove={gameState.lastMove}
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
      <div>
        you are playing as <span className="text-red-500">{playerColor}</span>{" "}
        and the turn of the current player is{" "}
        <span className="text-green-500">{gameState.currentPlayer}</span>{" "}
      </div>
      <div>{players.map((player) => player.id).join(" vs ")}</div>
    </div>
  );
}
