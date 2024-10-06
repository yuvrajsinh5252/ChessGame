"use client"

import { useChessStore } from "@/store/useChessStore";
import { ChessPiece } from "./chess-piece";

export default function ChessBoard() {
  const { board, movePiece } = useChessStore();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toRow: number, toCol: number) => {
    e.preventDefault();
    const [fromRow, fromCol] = e.dataTransfer.getData("text").split(",").map(Number);
    movePiece(fromRow, fromCol, toRow, toCol);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-8 gap-0">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 flex items-center justify-center ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"
              }`}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            onDragOver={handleDragOver}
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
  );
}