"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { initialBoard } from "@/utils/initialSetup";
import { handlePlayerMove, getGameState } from "@/app/server";

export function OnlineBoard({
  roomId,
  player,
}: {
  roomId: string;
  player: "white" | "black";
}) {
  const [boardState, setBoardState] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const gameState = await getGameState(roomId);
        setBoardState(gameState.board);
      } catch (error) {
        console.error("Failed to fetch game state:", error);
      }
    };

    fetchGameState();

    const channel = pusherClient.subscribe(`room-${roomId}`);

    channel.bind("move", (data: { board: any; currentPlayer: string }) => {
      setBoardState(data.board);
    });

    return () => {
      channel.unbind("move");
      pusherClient.unsubscribe(`room-${roomId}`);
    };
  }, [roomId]);

  const handleCellClick = (row: number, col: number) => {
    if (selectedPiece) {
      const newBoard = [...boardState];
      newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col];
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      setBoardState(newBoard);
      setSelectedPiece(null);

      handlePlayerMove(roomId, selectedPiece, { row, col }, player);
    } else {
      if (boardState[row][col]) {
        setSelectedPiece({ row, col });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <div className="grid grid-cols-8 gap-0">
          {boardState.map((row: any[], rowIndex: number) =>
            row.map((cell: any, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-12 w-12 flex justify-center items-center ${
                  (rowIndex + colIndex) % 2 === 0
                    ? "bg-gray-300"
                    : "bg-gray-500"
                } ${
                  selectedPiece?.row === rowIndex &&
                  selectedPiece?.col === colIndex
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
