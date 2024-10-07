"use client"

import { useChessStore } from "@/store/useChessStore";
import { ChessPiece } from "./chess-piece";
import { useEffect, useState } from "react";
import { isMovePossible } from "@/utils/possible-moves";

export default function ChessBoard() {
  const { board, movePiece, isValidMove, isKingInCheck, currentPlayer } = useChessStore();
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

  // remove selected piece if it's been captured
  useEffect(() => {
    if (selectedPiece) {
      const { row, col } = selectedPiece;
      if (!board[row][col]) setSelectedPiece(null);
    }
  })

  // piece click handler
  const handlePieceClick = (row: number, col: number) => {
    if (board && !board[row][col]) return;
    if (currentPlayer === "black" && board[row][col] === board[row][col]?.toUpperCase()) return
    if (currentPlayer === "white" && board[row][col] === board[row][col]?.toLowerCase()) return

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

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="grid grid-cols-8 gap-0 border-2 rounded-lg relative">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 flex items-center justify-center
              ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"}
              ${rowIndex === 0 && colIndex === 0 ? "rounded-tl-lg" : ""}
              ${rowIndex === 0 && colIndex === 7 ? "rounded-tr-lg" : ""}
              ${rowIndex === 7 && colIndex === 0 ? "rounded-bl-lg" : ""}
              ${rowIndex === 7 && colIndex === 7 ? "rounded-br-lg" : ""}
              ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ?
                  (board[selectedPiece.row][selectedPiece.col] === board[selectedPiece.row][selectedPiece.col]?.toUpperCase()
                    ? "ring-2 z-50 ring-yellow-500"
                    : "ring-2 z-50 ring-blue-500")
                  : ""}
              ${selectedPiece && isMovePossible(board, selectedPiece.row, selectedPiece.col, rowIndex, colIndex) ? "ring-2 z-50 ring-green-500" : ""}
              ${board[rowIndex][colIndex] === isKingInCheck ? "ring-2 z-50 ring-red-500" : ""}
              `}
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
        {/* Add symbolic notation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`row-${index}`}
              className="absolute left-0 w-4 h-16 flex items-center justify-center text-[8px] text-black"
              style={{ top: `${index * 12.5 - 4}%` }}
            >
              {8 - index}
            </div>
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`col-${index}`}
              className="absolute bottom-0 w-16 h-4 flex items-center justify-center text-[8px] text-black"
              style={{ left: `${index * 12.5 - 5}%` }}
            >
              {String.fromCharCode(97 + index)}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}