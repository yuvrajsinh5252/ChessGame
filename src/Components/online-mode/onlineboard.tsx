"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { handlePlayerMove, getGameState } from "@/app/server";
import { OnlineChessPiece } from "./chessPiece";
import { LoadingBoard } from "../loadingBoard";
import useOnlineChessStore from "@/store/useOnlineChessStore";
import { PieceType } from "@/types/chess";
import { GameState } from "@/types/onlineChess";

export function OnlineBoard({
  roomId,
  player,
}: {
  roomId: string;
  player: "white" | "black";
}) {
  const { gameState, players, updateGameState, updatePlayersState } =
    useOnlineChessStore((state) => state);

  const [isLoading, setisLoading] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const data = await getGameState(roomId);
        updateGameState(data.gameState);
        updatePlayersState(data.players);
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

  const handleCellClick = (row: number, col: number) => {
    if (selectedPiece) {
      handlePlayerMove(roomId, selectedPiece, { row, col }, player);
      setSelectedPiece(null);
    } else setSelectedPiece({ row, col });
  };

  if (isLoading) return <LoadingBoard />;

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div
        className={`grid grid-cols-8 gap-0 border-2 rounded-lg relative ${
          player === "black" ? "rotate-180" : ""
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
              ${player === "black" ? "rotate-180" : ""}
              `}
              onClick={() =>
                // gameState.currentPlayer == player &&
                handleCellClick(rowIndex, colIndex)
              }
            >
              <OnlineChessPiece
                type={cell}
                currentPlayer={gameState.currentPlayer}
                position={{ row: rowIndex, col: colIndex }}
                setSelectedPiece={setSelectedPiece}
                highlight={!!selectedPiece}
                lastMove={gameState.lastMove}
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
                player === "black" ? "rotate-180" : ""
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
                player === "black" ? "rotate-180" : ""
              }`}
              style={{ left: `${index * 12.5 - 5}%` }}
            >
              {String.fromCharCode(97 + index)}
            </div>
          ))}
        </div>
      </div>
      <div>
        {gameState.currentPlayer} {player}{" "}
      </div>
      <div>{players.map((player) => player.id).join(" vs ")}</div>
    </div>
  );
}
