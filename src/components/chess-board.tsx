"use client"

import { useChessStore } from "@/store/useChessStore";
import { ChessPiece } from "./chess-piece";
import { useState } from "react";
import { CurrentPlayer } from "./current-player";

export default function ChessBoard() {
  const { board, movePiece, isValidMove } = useChessStore();
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null);

  // drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toRow: number, toCol: number) => {
    e.preventDefault();
    const [fromRow, fromCol] = e.dataTransfer.getData("text").split(",").map(Number);
    movePiece(fromRow, fromCol, toRow, toCol);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // piece click handler
  const handlePieceClick = (row: number, col: number) => {
    if (selectedPiece) {
      if (movePiece(selectedPiece.row, selectedPiece.col, row, col)) {
        setSelectedPiece(null);
      } else if (board[row][col] && isValidMove(row, col, row, col)) {
        setSelectedPiece({ row, col });
      }
    } else if (board[row][col]) {
      setSelectedPiece({ row, col });
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="grid grid-cols-8 gap-0">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 flex items-center justify-center ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"
                }`}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onDragOver={handleDragOver}
              onClick={() => handlePieceClick(rowIndex, colIndex)}
            >
              {piece && (
                <ChessPiece
                  type={piece}
                  position={{ row: rowIndex, col: colIndex }}
                />
              )}
            </div>
          ))
        )}
      </div>
      <CurrentPlayer />
    </div>
  );
}